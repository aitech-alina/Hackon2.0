import re

class WorkflowEngine:
    def __init__(self):
        pass

    def extract_data(self, text):
        # Regex for dates (DD/MM/YYYY)
        dates = re.findall(r"\b\d{1,2}/\d{1,2}/\d{4}\b", text)
        # Regex for amounts ($0.00)
        amounts = re.findall(r"\$\d+\.\d{2}", text)
        return {
            "dates": dates,
            "amounts": amounts
        }

    def classify_document(self, text):
        text_lower = text.lower()
        if "invoice" in text_lower or "bill" in text_lower:
            return "Invoice"
        elif "id" in text_lower or "license" in text_lower or "passport" in text_lower:
            return "ID"
        else:
            return "Other"

    def process(self, text):
        extracted_data = self.extract_data(text)
        category = self.classify_document(text)
        return {
            "extracted_data": extracted_data,
            "category": category
        }