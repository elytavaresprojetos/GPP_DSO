#!/usr/bin/env python3
import subprocess
import os
from datetime import datetime

os.chdir(r"c:\Curso\Projeto DSO SPDATA")

print("=" * 70)
print("ATUALIZAÇÃO DO REPOSITÓRIO GITHUB - DSO CARTÃO DESCONTO")
print("=" * 70)
print()

# 1. Verificar status
print("[1/4] Verificando status do repositório...")
result = subprocess.run(["git", "status", "--short"], capture_output=True, text=True)
print(result.stdout if result.stdout else "Sem mudanças")
print()

# 2. Adicionar arquivos
print("[2/4] Adicionando arquivos ao repositório...")
subprocess.run(["git", "add", "."], capture_output=True)
print("✓ Arquivos adicionados")
print()

# 3. Fazer commit
print("[3/4] Fazendo commit das mudanças...")
commit_msg = "feat: Adiciona módulo Cartão Desconto com questionário completo"
result = subprocess.run(["git", "commit", "-m", commit_msg], capture_output=True, text=True)
print(result.stdout if result.stdout else "Mudanças commitadas")
print()

# 4. Fazer push
print("[4/4] Enviando para o GitHub...")
result = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
if result.returncode == 0:
    print("✓ Push realizado com sucesso!")
    print(result.stdout)
else:
    print("⚠ Status do push:")
    print(result.stdout)
    print(result.stderr)

print()
print("=" * 70)
print("RESUMO DA ATUALIZAÇÃO")
print("=" * 70)
print(f"Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
print(f"Repositório: https://github.com/elytavaresprojetos/GPP_DSO")
print(f"Branch: main")
print()

# Verificar commit
result = subprocess.run(["git", "log", "-1", "--oneline"], capture_output=True, text=True)
print("Último commit:")
print(result.stdout)
