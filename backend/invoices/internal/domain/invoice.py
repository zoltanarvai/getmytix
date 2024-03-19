from pydantic_xml import BaseXmlModel, element
from typing import Literal


class Settings(BaseXmlModel, tag="beallitasok"):
    invoice_agent_key: str = element(tag="szamlaagentkulcs")
    e_invoice: bool = element(tag="eszamla")
    invoice_download: bool = element(tag="szamlaLetoltes")
    response_version: int = element(tag="valaszVerzio")


class Header(BaseXmlModel, tag="fejlec"):
    issue_date: str = element(tag="keltDatum")
    fulfillment_date: str = element(tag="teljesitesDatum")
    payment_deadline_date: str = element(tag="fizetesiHataridoDatum")
    payment_method: Literal['Bankkártya'] = element(tag="fizmod")
    currency: Literal['HUF'] = element(tag="penznem")
    invoice_language: Literal['hu'] = element(tag="szamlaNyelve")
    comment: str | None = element(tag="megjegyzes", default="")
    order_number: str = element(tag="rendelesSzam")
    advance_invoice: bool = element(tag="elolegszamla")
    final_invoice: bool = element(tag="vegszamla")
    corrective_invoice: bool = element(tag="helyesbitoszamla")
    proforma_invoice_request: bool = element(tag="dijbekero")
    invoice_prefix: str = element(tag="szamlaszamElotag")


class Seller(BaseXmlModel, tag="elado"):
    bank: str = element(tag="bank")
    account_number: str = element(tag="bankszamlaszam")


class Buyer(BaseXmlModel, tag="vevo"):
    name: str = element(tag="nev")
    postal_code: str = element(tag="irsz")
    city: str = element(tag="telepules")
    address: str = element(tag="cim")
    email: str = element(tag="email")
    send_email: bool = element(tag="sendEmail")
    tax_number: str = element(tag="adoszam")


class Item(BaseXmlModel, tag="tetel"):
    description: str = element(tag="megnevezes")
    quantity: float = element(tag="mennyiseg")
    unit: str = element(tag="mennyisegiEgyseg")
    net_unit_price: float = element(tag="nettoEgysegar")
    tax_rate: int = element(tag="afakulcs")
    net_value: float = element(tag="nettoErtek")
    tax_value: float = element(tag="afaErtek")
    gross_value: float = element(tag="bruttoErtek")
    comment: str | None = element(tag="megjegyzes", default="")


class Items(BaseXmlModel, tag="tetelek"):
    items: list[Item] = element(tag="tetel")


class Invoice(BaseXmlModel, tag="xmlszamla", nsmap={'': "http://www.szamlazz.hu/xmlszamla"}):
    settings: Settings = element(tag="beallitasok")
    header: Header = element(tag="fejlec")
    seller: Seller = element(tag="elado")
    buyer: Buyer = element(tag="vevo")
    items: Items = element(tag="tetelek")


class InvoiceResponse(BaseXmlModel, tag="xmlszamlavalasz", nsmap={"": "http://www.szamlazz.hu/xmlszamlavalasz"}):
    success: bool = element(tag="sikeres")
    invoice_number: str | None = element(tag="szamlaszam", default=None)
    invoice_net: float | None = element(tag="szamlanetto", default=None)
    invoice_gross: float | None = element(tag="szamlabrutto", default=None)
    outstanding_amount: float | None = element(tag="kintlevoseg", default=None)
    customer_account_url: str | None = element(tag="vevoifiokurl", cdata=True, default=None)
    error_code: str | None = element(tag="hibakod", cdata=True, default=None)
    error_message: str | None = element(tag="hibauzenet", cdata=True, default=None)