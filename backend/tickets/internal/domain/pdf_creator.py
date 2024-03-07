import io
import logging
import os

from qrcode.image.pil import PilImage
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from PIL import Image

from tickets.internal.domain.order import Ticket


class PDFCreator:
    def __init__(self, base_dir: str):
        self._base_dir = base_dir
        self._logo_path = os.path.join(self._base_dir, "static", "event_logo.jpg")
        self._logo_img = Image.open(self._logo_path)

    def create_pdf(self, event_name: str, start_date: str, location: str, ticket: Ticket, qr_image: PilImage) -> io.BytesIO:
        logging.info("Creating pdf ticket...")

        pdf_stream = io.BytesIO()

        c = canvas.Canvas(pdf_stream, pagesize=letter)
        width, height = letter
        center = width / 2
        offset_top = 50  # Offset for the top elements (title, start date, location)

        # Title
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(center, height - offset_top, event_name)

        # Start Date
        offset_top += 30
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(center, height - offset_top, start_date)

        # Location
        offset_top += 30
        c.drawCentredString(center, height - offset_top, location)

        # QR Code below Location, centered with automatic height calculation
        qr_size = 100  # QR code size (width)
        qr_y_position = height - offset_top - qr_size - 20  # Adjust Y position based on offset_top and desired gap
        c.drawInlineImage(qr_image, center - (qr_size / 2), qr_y_position, width=qr_size, height=qr_size)

        # Ticket Code below QR Code
        c.setFont("Helvetica", 12)
        c.drawCentredString(center, qr_y_position - 20,
                            f"Jegy kód: {ticket.ticket_code}")  # Adjust Y position for the ticket code

        # Set starting position for the left-aligned details below the QR code and ticket code
        offset_left = qr_y_position - 60  # Adjust as needed for aesthetics

        # Event Details on the Left
        c.setFont("Helvetica", 12)
        details = [
            f"Jegy típusa: {ticket.ticket_type}",
            f"Vendég neve: {ticket.guest_name or '-'}",
            f"Cég neve: {ticket.company_name or '-'}",
            f"Beosztás: {ticket.position or '-'}"
        ]
        for detail in details:
            c.drawString(50, offset_left, detail)
            offset_left -= 20  # Adjust spacing between details

        original_width, original_height = self._logo_img.size
        aspect_ratio = original_height / original_width

        # Set the new width to 100 pixels and calculate the new height
        logo_width = 200
        logo_height = aspect_ratio * logo_width

        logo_margin = 10  # Margin from the bottom right corner

        # Calculate the logo's bottom left corner coordinates
        logo_x = width - logo_width - logo_margin
        logo_y = logo_margin

        # Draw the logo image with the new dimensions
        c.drawInlineImage(self._logo_img, logo_x, logo_y, width=logo_width, height=logo_height)

        # Save PDF
        c.save()

        # Go back to start of stream
        pdf_stream.seek(0)

        return pdf_stream
