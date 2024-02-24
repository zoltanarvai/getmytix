import io
import logging

from qrcode.image.pil import PilImage
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

from tickets.internal.domain.order import Ticket


class PDFCreator:
    @staticmethod
    def create_pdf(event_name: str, start_date: str, location: str, ticket: Ticket, qr_image: PilImage) -> io.BytesIO:
        logging.info("Creating pdf ticket...")

        pdf_stream = io.BytesIO()

        c = canvas.Canvas(pdf_stream, pagesize=letter)
        width, height = letter

        center = width / 2

        # Put title in the middle top
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(center, height - 50, event_name)

        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(center, height - 70, start_date)
        c.drawCentredString(center, height - 90, location)

        # Drop QR Code to right
        c.drawInlineImage(qr_image, width - 120, height - 120, width=100, height=100)

        # Put event details on the left
        c.setFont("Helvetica", 14)
        c.drawString(50, 640, f"Jegy típus: {ticket.ticket_type}")

        c.setFont("Helvetica", 14)
        c.drawString(50, 660, f"Jegy kód: {ticket.ticket_code}")

        cursor = 660

        if ticket.guest_name:
            cursor += 20
            c.setFont("Helvetica", 14)
            c.drawString(50, cursor, f"Vendég náv: {ticket.guest_name}")

        if ticket.company_name:
            cursor += 20
            c.setFont("Helvetica", 14)
            c.drawString(50, cursor, f"Cég név: {ticket.company_name}")

        if ticket.position:
            cursor += 20
            c.setFont("Helvetica", 14)
            c.drawString(50, cursor, f"Beosztás: {ticket.position}")

        # Save PDF
        c.save()

        # Go back to start of stream
        pdf_stream.seek(0)

        return pdf_stream
