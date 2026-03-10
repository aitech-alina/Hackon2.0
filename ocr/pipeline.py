import cv2
import pytesseract
from PIL import Image
import numpy as np

class OCRPipeline:
    def __init__(self):
        # Windows Tesseract path
        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    def preprocess_image(self, image_path):
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        return thresh

    def text_detection(self, image):
        # Placeholder for YOLO/EAST detection
        # For now, return the whole image
        return image

    def extract_text(self, preprocessed_image):
        text = pytesseract.image_to_string(Image.fromarray(preprocessed_image))
        return text

    def process(self, image_path):
        preprocessed = self.preprocess_image(image_path)
        detected = self.text_detection(preprocessed)
        text = self.extract_text(detected)
        return text