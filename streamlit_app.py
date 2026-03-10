import streamlit as st
import pytesseract
from PIL import Image
import json
from transformers import pipeline
import numpy as np
import io
from datetime import datetime
import cv2
import os

# ============================================================================
# CONFIGURE TESSERACT PATH (Windows)
# ============================================================================
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Set page configuration
st.set_page_config(
    page_title="IDP - Intelligent Document Processing",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom styling
st.markdown("""
    <style>
    .main-header {
        color: #1f77b4;
        text-align: center;
        padding: 20px;
    }
    .summary-box {
        background-color: #f0f2f6;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h1 class='main-header'>📄 Intelligent Document Processing</h1>", unsafe_allow_html=True)

# ============================================================================
# SIDEBAR - WORKFLOW SETTINGS
# ============================================================================
with st.sidebar:
    st.header("⚙️ Workflow Settings")
    enable_ocr = st.checkbox("Enable OCR", value=True, help="Extract text using Tesseract OCR")
    enable_extraction = st.checkbox("Enable Data Extraction", value=True, help="Extract entities using NER")
    enable_classification = st.checkbox("Enable Classification", value=True, help="Classify document type")
    
    # Model loading option
    st.divider()
    st.markdown("### Performance Settings")
    use_lightweight_model = st.checkbox(
        "Use Lightweight NER Model", 
        value=False, 
        help="Faster but less accurate. Useful if model loading is slow."
    )
    
    st.divider()
    st.markdown("### About")
    st.info("""
    This application demonstrates:
    - **OCR**: Text extraction using Tesseract
    - **NER**: Named Entity Recognition using Transformers
    - **Classification**: AI-based document categorization
    """)

# Store model choice in session state
if "use_lightweight_model" not in st.session_state:
    st.session_state.use_lightweight_model = False

# ============================================================================
# LOAD ML MODELS WITH CACHING
# ============================================================================
@st.cache_resource
def load_ner_model():
    """Load the NER model once and cache it for performance"""
    try:
        st.info("⏳ Loading NER model (this may take 30-60 seconds on first run)...")
        
        # Use verified, accurate NER model
        ner_pipeline = pipeline(
            "ner", 
            model="dslim/bert-base-NER",
            aggregation_strategy="simple",
            device=-1  # Use CPU
        )
        
        st.success("✅ NER model loaded successfully")
        return ner_pipeline
    except Exception as e:
        st.warning(f"⚠️ Failed to load primary NER model: {str(e)}")
        st.info("⏳ Trying alternative model...")
        
        try:
            # Fallback to multilingual model
            ner_pipeline = pipeline(
                "ner",
                model="xlm-roberta-large",
                aggregation_strategy="simple",
                device=-1
            )
            st.success("✅ Alternative NER model loaded")
            return ner_pipeline
        except Exception as e2:
            st.error(f"❌ Could not load NER model: {e2}")
            st.warning("⚠️ Entity extraction will use rule-based approach")
            return None

@st.cache_resource
def load_lightweight_ner_model():
    """Load a lightweight NER model for faster performance"""
    try:
        st.info("⏳ Loading lightweight NER model...")
        
        # Use smaller model for better performance
        ner_pipeline = pipeline(
            "ner",
            model="dslim/bert-small-NER",
            aggregation_strategy="simple",
            device=-1  # Use CPU
        )
        
        st.success("✅ Lightweight NER model loaded")
        return ner_pipeline
    except Exception as e:
        st.warning(f"⚠️ Lightweight model failed: {str(e)}")
        st.info("⏳ Using standard model instead...")
        return load_ner_model()

def get_ner_pipeline(use_lightweight=False):
    """Get appropriate NER pipeline based on user preference"""
    if use_lightweight:
        return load_lightweight_ner_model()
    else:
        return load_ner_model()

# ============================================================================
# RULE-BASED ENTITY EXTRACTION (FALLBACK)
# ============================================================================
def extract_entities_rule_based(text):
    """Rule-based entity extraction when ML model fails"""
    if not text:
        return {}
    
    organized_entities = {
        "PERSON": [],
        "ORGANIZATION": [],
        "LOCATION": [],
        "DATE": [],
        "MONEY": [],
    }
    
    # Extract capitalized sequences (names)
    names_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
    names = re.findall(names_pattern, text)
    for name in names[:5]:  # Limit to top 5
        if len(name) > 2 and name not in ["The", "This", "That", "From", "With"]:
            organized_entities["PERSON"].append({"text": name, "confidence": 0.7})
    
    # Extract dates
    date_pattern = r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b'
    dates = re.findall(date_pattern, text)
    for date in dates:
        organized_entities["DATE"].append({"text": date, "confidence": 0.9})
    
    # Extract amounts
    amount_pattern = r'(?:[$£€]?\s*\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*[$£€])'
    amounts = re.findall(amount_pattern, text)
    for amount in amounts:
        organized_entities["MONEY"].append({"text": amount, "confidence": 0.85})
    
    # Remove empty categories
    return {k: v for k, v in organized_entities.items() if v}

# ============================================================================
# OCR FUNCTION
# ============================================================================
def extract_text_from_image(image_path_or_object):
    """Extract text from image using Tesseract OCR"""
    try:
        if isinstance(image_path_or_object, str):
            image = Image.open(image_path_or_object)
        else:
            image = Image.open(io.BytesIO(image_path_or_object.read()))
        
        text = pytesseract.image_to_string(image)
        return text if text.strip() else None
    except Exception as e:
        st.error(f"OCR Error: {e}")
        return None

# ============================================================================
# ENTITY EXTRACTION FUNCTION
# ============================================================================
def extract_entities(text, ner_pipeline):
    """Extract named entities from text using HuggingFace Transformers or rule-based fallback"""
    if not text:
        return None
    
    # If model loaded successfully, use it
    if ner_pipeline:
        try:
            entities = ner_pipeline(text[:512])  # Limit text length for performance
            
            # Organize entities by type
            organized_entities = {
                "PERSON": [],
                "ORGANIZATION": [],
                "LOCATION": [],
                "DATE": [],
                "MONEY": [],
                "OTHER": []
            }
            
            for entity in entities:
                label = entity.get("entity_group", "OTHER")
                word = entity.get("word", "")
                score = entity.get("score", 0)
                
                if label in organized_entities:
                    organized_entities[label].append({
                        "text": word,
                        "confidence": round(score, 3)
                    })
                else:
                    organized_entities["OTHER"].append({
                        "text": word,
                        "confidence": round(score, 3)
                    })
            
            # Remove empty categories
            return {k: v for k, v in organized_entities.items() if v}
        except Exception as e:
            st.warning(f"⚠️ ML model extraction failed, using rule-based approach: {str(e)}")
            return extract_entities_rule_based(text)
    
    # Fallback: use rule-based extraction if model not available
    return extract_entities_rule_based(text)

# ============================================================================
# DOCUMENT CLASSIFICATION FUNCTION
# ============================================================================
def classify_document(text):
    """Classify document type based on keyword matching"""
    if not text:
        return "Unknown", 0
    
    text_lower = text.lower()
    
    # Define keywords for each category
    classifiers = {
        "Invoice": ["invoice", "bill", "amount due", "total", "supplier", "invoice no"],
        "Receipt": ["receipt", "purchased", "thank you", "date of purchase", "amount paid"],
        "Contract": ["agreement", "contract", "terms and conditions", "clause", "signature", "party"],
        "Report": ["report", "executive summary", "findings", "conclusion", "analysis", "data"],
        "Resume": ["resume", "curriculum vitae", "cv", "experience", "education", "skills", "objective"],
        "General Document": ["document", "letter", "memo", "note"]
    }
    
    scores = {}
    for category, keywords in classifiers.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        scores[category] = score
    
    best_category = max(scores, key=scores.get)
    confidence = scores[best_category] / len(classifiers[best_category])
    
    return best_category, min(confidence, 1.0)

# ============================================================================
# FIELD EXTRACTION FUNCTION (NEW)
# ============================================================================
import re

def extract_key_fields(text):
    """Extract structured fields from OCR text using regex and pattern matching"""
    if not text:
        return {}
    
    fields = {}
    
    # Extract Name (capitalized words sequence)
    name_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
    names = re.findall(name_pattern, text)
    if names:
        fields["name"] = names[0]
    
    # Extract Email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    if emails:
        fields["email"] = emails[0]
    
    # Extract Phone Number (multiple formats)
    phone_pattern = r'(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b'
    phones = re.findall(phone_pattern, text)
    if phones:
        fields["phone"] = phones[0]
    
    # Extract Date (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD formats)
    date_pattern = r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b'
    dates = re.findall(date_pattern, text)
    if dates:
        fields["date"] = dates[0]
    
    # Extract Amount (currency values)
    amount_pattern = r'(?:[$£€]?\s*\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*[$£€])'
    amounts = re.findall(amount_pattern, text)
    if amounts:
        fields["amount"] = amounts[0]
    
    return fields

# ============================================================================
# ENTITY STATISTICS FUNCTION (NEW)
# ============================================================================
def get_entity_statistics(entities):
    """Generate entity count statistics"""
    if not entities:
        return {}
    
    stats = {}
    for entity_type, entities_list in entities.items():
        stats[entity_type] = len(entities_list)
    
    return stats

# ============================================================================
# PROCESSING INSIGHTS FUNCTION (NEW)
# ============================================================================
def calculate_processing_insights(ocr_text, entities, fields):
    """Calculate advanced processing metrics"""
    if not ocr_text:
        return {}
    
    insights = {
        "total_characters": len(ocr_text),
        "total_words": len(ocr_text.split()),
        "average_word_length": round(len(ocr_text) / len(ocr_text.split()), 2) if ocr_text.split() else 0,
        "total_entities": sum(len(v) for v in (entities or {}).values()),
        "extracted_fields_count": len(fields),
        "sentences": len(ocr_text.split('.')),
        "language_complexity": "Low" if len(ocr_text.split()) < 50 else "Medium" if len(ocr_text.split()) < 200 else "High"
    }
    
    return insights

# ============================================================================
# ERROR HANDLING WRAPPER (NEW)
# ============================================================================
def safe_process_document(ocr_text, ner_model, enable_extraction, enable_classification):
    """Safely process document with comprehensive error handling"""
    results = {
        "ocr_text": ocr_text,
        "entities": None,
        "classification": None,
        "fields": {},
        "insights": {},
        "entity_stats": {},
        "success": ocr_text is not None
    }
    
    if not ocr_text:
        return results
    
    try:
        # Entity Extraction
        if enable_extraction:
            try:
                entities = extract_entities(ocr_text, ner_model)
                results["entities"] = entities
                results["entity_stats"] = get_entity_statistics(entities)
            except Exception as e:
                st.warning(f"⚠️ Entity extraction failed: {str(e)}")
                results["entities"] = None
        
        # Classification
        if enable_classification:
            try:
                doc_type, confidence = classify_document(ocr_text)
                results["classification"] = {
                    "type": doc_type,
                    "confidence": round(confidence, 3)
                }
            except Exception as e:
                st.warning(f"⚠️ Classification failed: {str(e)}")
                results["classification"] = None
        
        # Field Extraction
        try:
            fields = extract_key_fields(ocr_text)
            results["fields"] = fields
        except Exception as e:
            st.warning(f"⚠️ Field extraction failed: {str(e)}")
            results["fields"] = {}
        
        # Processing Insights
        try:
            insights = calculate_processing_insights(ocr_text, results["entities"], results["fields"])
            results["insights"] = insights
        except Exception as e:
            st.warning(f"⚠️ Insights calculation failed: {str(e)}")
            results["insights"] = {}
        
        return results
    
    except Exception as e:
        st.error(f"❌ Unexpected error during processing: {str(e)}")
        return results

# File uploader
uploaded_file = st.file_uploader("📤 Upload Document Image", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    # Create columns for layout
    col1, col2 = st.columns([1, 1])
    
    # Display uploaded image
    with col1:
        st.subheader("📸 Uploaded Image")
        image = Image.open(uploaded_file)
        st.image(image, use_column_width=True)
    
    # Processing button and workflow
    with col2:
        st.subheader("🔄 Processing Options")
        
        if st.button("🚀 Process Document", key="process_btn", use_container_width=True):
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            results = {
                "timestamp": datetime.now().isoformat(),
                "filename": uploaded_file.name,
                "ocr_text": None,
                "entities": None,
                "classification": None,
                "fields": {},
                "insights": {},
                "entity_stats": {},
                "summary": {}
            }
            
            # ========== OCR PROCESSING ==========
            if enable_ocr:
                status_text.text("⏳ Extracting text with OCR...")
                uploaded_file.seek(0)
                extracted_text = extract_text_from_image(uploaded_file)
                
                if extracted_text:
                    results["ocr_text"] = extracted_text
                    st.success("✅ OCR completed")
                    progress_bar.progress(33)
                else:
                    st.warning("⚠️ No text could be extracted from the image")
                    progress_bar.progress(33)
            
            # ========== COMPREHENSIVE PROCESSING WITH NEW FEATURES ==========
            if results["ocr_text"]:
                status_text.text("⏳ Processing document...")
                
                # Load NER model based on user preference
                ner_model = get_ner_pipeline(use_lightweight=use_lightweight_model)
                
                # Use safe processing wrapper for all new features
                process_results = safe_process_document(
                    results["ocr_text"], 
                    ner_model, 
                    enable_extraction, 
                    enable_classification
                )
                
                # Merge results
                results.update(process_results)
                progress_bar.progress(100)
            
            # ========== GENERATE SUMMARY ==========
            if results["ocr_text"]:
                results["summary"] = {
                    "text_length": len(results["ocr_text"]),
                    "word_count": len(results["ocr_text"].split()),
                    "entities_count": sum(len(v) for v in (results["entities"] or {}).values()),
                    "fields_extracted": len(results["fields"]),
                    "document_type": results["classification"]["type"] if results["classification"] else "Unknown"
                }
            
            status_text.empty()
            progress_bar.empty()
            
            # ========== DISPLAY RESULTS ==========
            st.divider()
            st.subheader("📊 Processing Results")
            
            # Summary Panel
            if results["summary"]:
                col1, col2, col3, col4, col5 = st.columns(5)
                with col1:
                    st.metric("📝 Document Type", results["summary"]["document_type"])
                with col2:
                    st.metric("📄 Text Length", f"{results['summary']['text_length']} chars")
                with col3:
                    st.metric("📚 Word Count", results["summary"]["word_count"])
                with col4:
                    st.metric("🏷️ Entities Found", results["summary"]["entities_count"])
                with col5:
                    st.metric("📋 Fields Found", results["summary"]["fields_extracted"])
            
            # OCR Results
            if results["ocr_text"]:
                with st.expander("🔤 Extracted Text", expanded=True):
                    st.text_area("Extracted Text:", value=results["ocr_text"], height=200, disabled=True)
            
            # NEW: Key Information Extracted Section
            if results["fields"]:
                with st.expander("🔑 Key Information Extracted", expanded=True):
                    cols = st.columns(len(results["fields"]))
                    field_items = list(results["fields"].items())
                    for idx, (field_name, field_value) in enumerate(field_items):
                        with cols[idx % len(cols)]:
                            st.write(f"**{field_name.upper()}**")
                            st.code(field_value, language="text")
            
            # Entity Extraction Results
            if results["entities"]:
                with st.expander("🏷️ Extracted Entities", expanded=True):
                    for entity_type, entities_list in results["entities"].items():
                        st.markdown(f"**{entity_type}**")
                        for entity in entities_list:
                            st.write(f"- {entity['text']} (Confidence: {entity['confidence']})")
            
            # NEW: Entity Statistics Section
            if results["entity_stats"]:
                with st.expander("📊 Entity Statistics", expanded=False):
                    col1, col2 = st.columns([1, 2])
                    
                    with col1:
                        st.markdown("### Count by Type")
                        for entity_type, count in results["entity_stats"].items():
                            st.write(f"- **{entity_type}**: {count}")
                    
                    with col2:
                        # Create a bar chart
                        import pandas as pd
                        df_stats = pd.DataFrame(list(results["entity_stats"].items()), columns=["Entity Type", "Count"])
                        st.bar_chart(data=df_stats.set_index("Entity Type"), height=300)
            
            # Classification Results
            if results["classification"]:
                with st.expander("📂 Document Classification", expanded=True):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.markdown(f"**Document Type:** {results['classification']['type']}")
                    with col2:
                        st.markdown(f"**Confidence:** {results['classification']['confidence']:.1%}")
            
            # NEW: Processing Insights Section
            if results["insights"]:
                with st.expander("📈 Processing Insights", expanded=False):
                    col1, col2, col3, col4 = st.columns(4)
                    
                    with col1:
                        st.metric("Total Characters", results["insights"]["total_characters"])
                    with col2:
                        st.metric("Total Words", results["insights"]["total_words"])
                    with col3:
                        st.metric("Avg Word Length", results["insights"]["average_word_length"])
                    with col4:
                        st.metric("Sentences", results["insights"]["sentences"])
                    
                    # Additional metrics on second row
                    col5, col6 = st.columns(2)
                    with col5:
                        st.metric("Total Entities", results["insights"]["total_entities"])
                    with col6:
                        st.metric("Language Complexity", results["insights"]["language_complexity"])
            
            # NEW: Export Section
            st.divider()
            st.subheader("⬇️ Export Options")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                # Create comprehensive export data
                export_data = {
                    "metadata": {
                        "timestamp": results["timestamp"],
                        "filename": results["filename"]
                    },
                    "extracted_text": results["ocr_text"],
                    "detected_entities": results["entities"],
                    "document_category": results["classification"],
                    "extracted_fields": results["fields"],
                    "entity_statistics": results["entity_stats"],
                    "processing_insights": results["insights"],
                    "summary": results["summary"]
                }
                
                json_str = json.dumps(export_data, indent=2)
                st.download_button(
                    label="📥 Download Processed Data",
                    data=json_str,
                    file_name=f"idp_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json",
                    use_container_width=True
                )
            
            with col2:
                # Also keep the original results export for backward compatibility
                json_str_original = json.dumps(results, indent=2)
                st.download_button(
                    label="📥 Download Full Results",
                    data=json_str_original,
                    file_name=f"idp_full_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json",
                    use_container_width=True
                )
            
            with col3:
                # Display raw JSON
                with st.expander("📋 View Raw JSON", expanded=False):
                    st.json(export_data)