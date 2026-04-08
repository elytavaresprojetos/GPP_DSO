import docx

doc = docx.Document('ID Cliente - ID Projeto - DSO Implantação_Carnê Desconto_GERC (1).docx')
full_text = []
for para in doc.paragraphs:
    full_text.append(para.text)
print('\n'.join(full_text))