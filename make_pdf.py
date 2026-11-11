from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
W,H=A4;c=canvas.Canvas('qr-codes.pdf',pagesize=A4);cw,ch=W/2,H/3;S=62*mm
for i,n in enumerate(range(1,6)):
    x0=(i%2)*cw;y0=H-(i//2+1)*ch
    c.setDash(2,2);c.setStrokeGray(.75);c.rect(x0,y0,cw,ch)
    w=qr.QrCodeWidget('NUM:%d'%n);b=w.getBounds();k=S/(b[2]-b[0])
    d=Drawing(S,S,transform=[k,0,0,k,0,0]);d.add(w);renderPDF.draw(d,c,x0+(cw-S)/2,y0+22*mm)
    c.setFont('Helvetica-Bold',60);c.setFillGray(0);c.drawCentredString(x0+cw/2,y0+6*mm,str(n))
c.save()
