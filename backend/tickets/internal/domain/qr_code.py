import logging
import qrcode
from qrcode.image.pil import PilImage


class QRCode:
    def __init__(self):
        self._qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )

    def generate(self, url: str) -> PilImage:
        logging.info(f"Generating QR Code for {url}")

        self._qr.add_data(url)
        self._qr.make(fit=True)

        return self._qr.make_image(fill_color="black", back_color="white")