/**
 * =====================================================
 * SPDATA DSO - SISTEMA DE DIAGNÓSTICO SITUACIONAL
 * Arquivo: app.js
 * Versão: 2.0
 * =====================================================
 */

// ==================== CONFIGURAÇÕES GLOBAIS ====================

const CONFIG = {
    storageKey: 'spdata_dso',
    autoSaveInterval: 30000,
    version: '2.0'
};

// ==================== ESTADO DA APLICAÇÃO ====================

let estadoApp = {
    viewAtual: 1,
    moduloSelecionado: null,
    dadosIdentificacao: {},
    dadosQuestionario: {},
    imagensAnexadas: []
};

// ==================== DEFINIÇÃO DOS MÓDULOS ====================

const MODULOS = {
    // ============================================================
    // MÓDULO 1: RECEPÇÃO EXTERNA
    // ============================================================
    "recepcao_externa": {
        id: "recepcao_externa",
        titulo: "Recepção Externa",
        icone: "🏥",
        categoria: "assistencial",
        descricao: "Atendimento inicial, cadastro de pacientes e agendamentos",
        setor: "Recepção",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Recepção Externa na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                descricao: "Listar os participantes da entrevista",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                descricao: "Usada para esclarecer as funções e responsabilidades dos funcionários para cada tarefa e decisão que ocorrem ao longo do projeto",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável (Quem é responsável por trabalhar na tarefa?)", tipo: "text" },
                    { id: "aprovador", label: "Aprovador (Quem tem autoridade para aprovar a tarefa ou etapa?)", tipo: "text" },
                    { id: "consultado", label: "Consultado (Quem deve ser consultado para participar da tarefa?)", tipo: "text" },
                    { id: "informado", label: "Informado (Quem deve ser informado a respeito do status da tarefa?)", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                descricao: "Profissional a ser certificado pela SPDATA",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "qtd_impressoras_termica", label: "Quantidade de impressoras Térmicas (Pulseira/Etiqueta)", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições (especificar equipamentos, quantidade e definição de prazos)", tipo: "textarea", rows: 3 },
                    { id: "equipamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_guiches", label: "Quantos guichês de atendimento?", tipo: "number" },
                    { id: "guiches_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "atendimento_painel", label: "Utiliza painel de senha para atendimento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "atendimento_painel_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_atendimento", label: "Quais os tipos de atendimentos são realizados?", tipo: "checkbox", opcoes: ["Eletivo", "Urgência/Emergência", "Internação", "Ambulatório", "SADT"] },
                    { id: "tipos_atendimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "volume_atendimentos", label: "Qual o volume médio de atendimentos diários?", tipo: "text" },
                    { id: "volume_atendimentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "picos_atendimento", label: "Quais são os horários de maior pico de atendimento?", tipo: "text" },
                    { id: "picos_atendimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "documentos_obrigatorios", label: "Quais documentos são obrigatórios no cadastro do paciente?", tipo: "textarea", rows: 3 },
                    { id: "documentos_obrigatorios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "pulseira_identificacao", label: "É utilizada pulseira de identificação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "pulseira_identificacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "etiqueta_identificacao", label: "É utilizada etiqueta de identificação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "etiqueta_identificacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "termo_consentimento", label: "É utilizado termo de consentimento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "termo_consentimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "convenios_atendidos", label: "Quais os convênios atendidos?", tipo: "textarea", rows: 3 },
                    { id: "convenios_atendidos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "elegibilidade", label: "É realizada verificação de elegibilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "elegibilidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "autorizacao_convenio", label: "É realizada autorização junto ao convênio?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "autorizacao_convenio_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "particular_pagamento", label: "Para atendimento particular, como é realizado o pagamento?", tipo: "textarea", rows: 2 },
                    { id: "particular_pagamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Recepção Externa",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_termica", label: "IMPRESSORA TÉRMICA (PULSEIRA/ETIQUETA)" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" },
                    { id: "painel_senha", label: "PAINEL DE SENHA" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 2: RECEPÇÃO INTERNA
    // ============================================================
    "recepcao_interna": {
        id: "recepcao_interna",
        titulo: "Recepção Interna",
        icone: "🏨",
        categoria: "assistencial",
        descricao: "Internação, controle de leitos e gestão de pacientes internados",
        setor: "Internação",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Recepção Interna/Internação na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                descricao: "Listar os participantes da entrevista",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                descricao: "Usada para esclarecer as funções e responsabilidades dos funcionários para cada tarefa e decisão que ocorrem ao longo do projeto",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável (Quem é responsável por trabalhar na tarefa?)", tipo: "text" },
                    { id: "aprovador", label: "Aprovador (Quem tem autoridade para aprovar a tarefa ou etapa?)", tipo: "text" },
                    { id: "consultado", label: "Consultado (Quem deve ser consultado para participar da tarefa?)", tipo: "text" },
                    { id: "informado", label: "Informado (Quem deve ser informado a respeito do status da tarefa?)", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                descricao: "Profissional a ser certificado pela SPDATA",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "equipamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_leitos", label: "Qual a quantidade total de leitos?", tipo: "number" },
                    { id: "qtd_leitos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_leitos", label: "Quais os tipos de leitos existentes?", tipo: "checkbox", opcoes: ["Enfermaria", "Apartamento", "UTI Adulto", "UTI Pediátrica", "UTI Neonatal", "Semi-intensiva", "Isolamento", "Observação"] },
                    { id: "tipos_leitos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "gestao_leitos", label: "Existe gestão de leitos centralizada (NIR)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "gestao_leitos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_higienizacao", label: "Existe controle de higienização de leitos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_higienizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_internacoes", label: "Qual a média de internações diárias?", tipo: "text" },
                    { id: "media_internacoes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tempo_medio_permanencia", label: "Qual o tempo médio de permanência?", tipo: "text" },
                    { id: "tempo_medio_permanencia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_alta", label: "Quais os tipos de alta existentes?", tipo: "checkbox", opcoes: ["Médica", "Administrativa", "Óbito", "Transferência", "Evasão", "Desistência"] },
                    { id: "tipos_alta_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "censo_diario", label: "É realizado censo diário?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "censo_diario_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "aih", label: "É emitida AIH (Autorização de Internação Hospitalar)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "aih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prorrogacao_aih", label: "É realizada prorrogação de AIH?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prorrogacao_aih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Recepção Interna",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_termica", label: "IMPRESSORA TÉRMICA (PULSEIRA/ETIQUETA)" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 3: AGENDAMENTO / REGULAÇÃO
    // ============================================================
    "agendamento": {
        id: "agendamento",
        titulo: "Agendamento / Regulação",
        icone: "📅",
        categoria: "assistencial",
        descricao: "Central de agendamento, regulação de consultas e exames",
        setor: "Central de Agendamento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Agendamento/Regulação na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                descricao: "Listar os participantes da entrevista",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                descricao: "Usada para esclarecer as funções e responsabilidades dos funcionários para cada tarefa e decisão que ocorrem ao longo do projeto",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável (Quem é responsável por trabalhar na tarefa?)", tipo: "text" },
                    { id: "aprovador", label: "Aprovador (Quem tem autoridade para aprovar a tarefa ou etapa?)", tipo: "text" },
                    { id: "consultado", label: "Consultado (Quem deve ser consultado para participar da tarefa?)", tipo: "text" },
                    { id: "informado", label: "Informado (Quem deve ser informado a respeito do status da tarefa?)", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                descricao: "Profissional a ser certificado pela SPDATA",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "equipamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_agendamento", label: "Quais tipos de agendamentos são realizados?", tipo: "checkbox", opcoes: ["Consultas", "Exames", "Cirurgias", "Procedimentos", "Retornos"] },
                    { id: "tipos_agendamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "especialidades", label: "Quais especialidades são agendadas?", tipo: "textarea", rows: 3 },
                    { id: "especialidades_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_agendamentos", label: "Qual a média de agendamentos diários?", tipo: "text" },
                    { id: "media_agendamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "canais_agendamento", label: "Quais canais de agendamento são utilizados?", tipo: "checkbox", opcoes: ["Presencial", "Telefone", "WhatsApp", "Site/Portal", "Aplicativo"] },
                    { id: "canais_agendamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "confirmacao_agendamento", label: "É realizada confirmação de agendamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "confirmacao_agendamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "lista_espera", label: "Existe controle de lista de espera?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "lista_espera_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "encaixes", label: "É permitido realizar encaixes na agenda?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "encaixes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "bloqueio_agenda", label: "É realizado bloqueio de agenda (férias, feriados)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "bloqueio_agenda_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sisreg", label: "Utiliza SISREG para regulação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sisreg_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Agendamento",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "headset", label: "HEADSET" },
                    { id: "telefone", label: "TELEFONE/RAMAL" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 4: FARMÁCIA / GESTÃO DE ESTOQUE
    // ============================================================
    "farmacia_estoque": {
        id: "farmacia_estoque",
        titulo: "Farmácia / Gestão de Estoque",
        icone: "💊",
        categoria: "apoio",
        descricao: "Controle de medicamentos, materiais e insumos hospitalares",
        setor: "Farmácia / Almoxarifado",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Farmácia e Gestão de Estoque na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                descricao: "Listar os participantes da entrevista",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                descricao: "Usada para esclarecer as funções e responsabilidades dos funcionários para cada tarefa e decisão que ocorrem ao longo do projeto",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável (Quem é responsável por trabalhar na tarefa?)", tipo: "text" },
                    { id: "aprovador", label: "Aprovador (Quem tem autoridade para aprovar a tarefa ou etapa?)", tipo: "text" },
                    { id: "consultado", label: "Consultado (Quem deve ser consultado para participar da tarefa?)", tipo: "text" },
                    { id: "informado", label: "Informado (Quem deve ser informado a respeito do status da tarefa?)", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                descricao: "Profissional a ser certificado pela SPDATA",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "equipamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_estoques", label: "Quantos estoques/almoxarifados existem?", tipo: "number" },
                    { id: "qtd_estoques_obs", label: "Observação (listar os estoques)", tipo: "textarea", rows: 3 },
                    { id: "estoques_separados", label: "Os estoques de medicamentos e materiais são separados?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "estoques_separados_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "dispensacao_paciente", label: "A dispensação é realizada por paciente?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "dispensacao_paciente_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "dispensacao_setor", label: "A dispensação é realizada por setor (CDC)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "dispensacao_setor_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_lote_validade", label: "É realizado controle de lote e validade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_lote_validade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rastreabilidade", label: "É realizada rastreabilidade de medicamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rastreabilidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "curva_abc", label: "É utilizado controle de Curva ABC?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "curva_abc_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "ponto_pedido", label: "É utilizado controle de ponto de pedido (estoque mínimo/máximo)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "ponto_pedido_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "inventario", label: "É realizado inventário periódico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "inventario_periodicidade", label: "Se sim, qual a periodicidade?", tipo: "text" },
                    { id: "inventario_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "portaria_344", label: "Possui controle de medicamentos controlados (Portaria 344)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "portaria_344_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "consignados", label: "Trabalha com materiais consignados (OPME)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "consignados_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "fracionamento", label: "É realizado fracionamento de medicamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "fracionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "unitarizacao", label: "É realizada unitarização de medicamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "unitarizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "devolucao", label: "Existe rotina de devolução de materiais e medicamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "devolucao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "transferencia", label: "É realizada transferência entre estoques?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "transferencia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "requisicao_interna", label: "Existe rotina de requisição interna de materiais?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "requisicao_interna_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "cobranca_automatica", label: "A cobrança de mat/med é automática na conta do paciente?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "cobranca_automatica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_compras", label: "Existe integração com o setor de compras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_compras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Farmácia/Estoque",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" },
                    { id: "coletor_dados", label: "COLETOR DE DADOS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

// ... Continua na Parte 2
    // ============================================================
    // MÓDULO 5: FATURAMENTO SUS (AIH)
    // ============================================================
    "faturamento_aih": {
        id: "faturamento_aih",
        titulo: "Faturamento SUS (AIH)",
        icone: "🏛️",
        categoria: "faturamento",
        descricao: "Faturamento de internações pelo SUS - AIH",
        setor: "Faturamento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Faturamento AIH na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                descricao: "Listar os participantes da entrevista",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                descricao: "Usada para esclarecer as funções e responsabilidades dos funcionários",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "cnes", label: "Qual o número do CNES?", tipo: "text" },
                    { id: "cnes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_aihs", label: "Qual a média mensal de AIHs faturadas?", tipo: "text" },
                    { id: "media_aihs_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_aih", label: "Quais tipos de AIH são faturados?", tipo: "checkbox", opcoes: ["AIH 1 - Principal", "AIH 5 - Longa Permanência", "AIH 3 - Prorrogação"] },
                    { id: "tipos_aih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "especialidades_internacao", label: "Quais especialidades de internação?", tipo: "textarea", rows: 3 },
                    { id: "especialidades_internacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "uti", label: "Possui leitos de UTI faturados pelo SUS?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "uti_qtd", label: "Se sim, quantos leitos?", tipo: "number" },
                    { id: "alta_complexidade", label: "Realiza procedimentos de alta complexidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "alta_complexidade_quais", label: "Se sim, quais?", tipo: "textarea", rows: 2 },
                    { id: "sisaih", label: "Utiliza o SISAIH01 para faturamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sisaih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "transmissao_bpa", label: "Realiza transmissão via BPA-MAG?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "transmissao_bpa_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "criticas_aih", label: "Como são tratadas as críticas da AIH?", tipo: "textarea", rows: 3 },
                    { id: "criticas_aih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "laudo_aih", label: "Quem preenche o laudo médico da AIH?", tipo: "text" },
                    { id: "laudo_aih_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "procedimentos_especiais", label: "É faturado OPM (Órteses, Próteses e Materiais)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "procedimentos_especiais_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Faturamento AIH",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 6: FATURAMENTO AMBULATORIAL (BPA)
    // ============================================================
    "faturamento_bpa": {
        id: "faturamento_bpa",
        titulo: "Faturamento Ambulatorial (BPA)",
        icone: "📊",
        categoria: "faturamento",
        descricao: "Faturamento de produção ambulatorial SUS - BPA",
        setor: "Faturamento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Faturamento BPA na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "media_procedimentos", label: "Qual a média mensal de procedimentos faturados?", tipo: "text" },
                    { id: "media_procedimentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipo_bpa", label: "Qual tipo de BPA é utilizado?", tipo: "checkbox", opcoes: ["BPA-C (Consolidado)", "BPA-I (Individualizado)"] },
                    { id: "tipo_bpa_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_producao", label: "Quais tipos de produção são faturados?", tipo: "checkbox", opcoes: ["Consultas", "Exames", "Procedimentos", "Terapias"] },
                    { id: "tipos_producao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "captacao_producao", label: "Como é realizada a captação da produção?", tipo: "textarea", rows: 3 },
                    { id: "captacao_producao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "bpa_mag", label: "Utiliza o BPA-MAG para faturamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "bpa_mag_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "fpo", label: "Utiliza FPO (Ficha de Programação Orçamentária)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "fpo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "teto_financeiro", label: "Existe controle de teto financeiro?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "teto_financeiro_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Faturamento BPA",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 7: FATURAMENTO APAC
    // ============================================================
    "faturamento_apac": {
        id: "faturamento_apac",
        titulo: "Faturamento APAC",
        icone: "📋",
        categoria: "faturamento",
        descricao: "Autorização de Procedimentos de Alta Complexidade",
        setor: "Faturamento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Faturamento APAC na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipos_apac", label: "Quais tipos de APAC são faturados?", tipo: "checkbox", opcoes: ["Quimioterapia", "Radioterapia", "Hemodiálise", "Medicamentos Especializados", "Outros"] },
                    { id: "tipos_apac_outros", label: "Se outros, especificar:", tipo: "text" },
                    { id: "tipos_apac_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_apacs", label: "Qual a média mensal de APACs faturadas?", tipo: "text" },
                    { id: "media_apacs_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "autorizacao_apac", label: "Como é realizado o processo de autorização da APAC?", tipo: "textarea", rows: 3 },
                    { id: "autorizacao_apac_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sia_apac", label: "Utiliza o SIA/APAC para faturamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sia_apac_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "renovacao_apac", label: "Existe rotina de renovação de APAC?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "renovacao_apac_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "laudo_apac", label: "Quem preenche o laudo da APAC?", tipo: "text" },
                    { id: "laudo_apac_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Faturamento APAC",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 8: FATURAMENTO CONVÊNIOS
    // ============================================================
    "faturamento_convenios": {
        id: "faturamento_convenios",
        titulo: "Faturamento Convênios",
        icone: "💳",
        categoria: "faturamento",
        descricao: "Faturamento de planos de saúde e convênios",
        setor: "Faturamento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Faturamento de Convênios na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_convenios", label: "Quantos convênios são atendidos?", tipo: "number" },
                    { id: "convenios_lista", label: "Listar os principais convênios:", tipo: "textarea", rows: 4 },
                    { id: "convenios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tabela_precos", label: "Quais tabelas de preços são utilizadas?", tipo: "checkbox", opcoes: ["CBHPM", "AMB", "TUSS", "Brasíndice", "Simpro", "Tabela Própria"] },
                    { id: "tabela_precos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tiss", label: "Utiliza o padrão TISS para faturamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "tiss_versao", label: "Se sim, qual versão?", tipo: "text" },
                    { id: "tiss_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "xml_convenios", label: "Envia XML para os convênios?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "xml_convenios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "portal_convenios", label: "Utiliza portal dos convênios para autorização?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "portal_convenios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "elegibilidade", label: "É realizada verificação de elegibilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "elegibilidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "autorizacao_previa", label: "Quais procedimentos exigem autorização prévia?", tipo: "textarea", rows: 3 },
                    { id: "autorizacao_previa_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "glosas", label: "Existe controle de glosas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "glosas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "recurso_glosas", label: "É realizado recurso de glosas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "recurso_glosas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "auditoria_contas", label: "Existe auditoria interna de contas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "auditoria_contas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Faturamento Convênios",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "scanner", label: "SCANNER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 9: FINANCEIRO
    // ============================================================
    "financeiro": {
        id: "financeiro",
        titulo: "Financeiro",
        icone: "💰",
        categoria: "administrativo",
        descricao: "Contas a pagar, receber e tesouraria",
        setor: "Financeiro",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Financeiro na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "contas_bancarias", label: "Quantas contas bancárias a instituição possui?", tipo: "number" },
                    { id: "contas_bancarias_lista", label: "Listar os bancos:", tipo: "textarea", rows: 2 },
                    { id: "contas_bancarias_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "contas_pagar", label: "É realizado controle de Contas a Pagar?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "contas_pagar_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "contas_receber", label: "É realizado controle de Contas a Receber?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "contas_receber_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "fluxo_caixa", label: "É realizado controle de Fluxo de Caixa?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "fluxo_caixa_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "conciliacao_bancaria", label: "É realizada conciliação bancária?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "conciliacao_bancaria_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "boletos", label: "É realizada emissão de boletos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "boletos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_bancaria", label: "Existe integração bancária (CNAB)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_bancaria_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "plano_contas", label: "Possui plano de contas definido?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "plano_contas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "centros_custo", label: "Possui estrutura de centros de custo?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "centros_custo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "nfe", label: "É emitida Nota Fiscal Eletrônica (NF-e)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "nfe_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "nfse", label: "É emitida Nota Fiscal de Serviço Eletrônica (NFS-e)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "nfse_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_contabil", label: "Existe integração com a contabilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_contabil_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Financeiro",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 10: COMPRAS
    // ============================================================
    "compras": {
        id: "compras",
        titulo: "Compras",
        icone: "🛒",
        categoria: "administrativo",
        descricao: "Gestão de compras, cotações e pedidos",
        setor: "Compras",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Compras na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipos_compras", label: "Quais tipos de compras são realizadas?", tipo: "checkbox", opcoes: ["Medicamentos", "Materiais Hospitalares", "Materiais de Escritório", "Equipamentos", "Serviços"] },
                    { id: "tipos_compras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_pedidos", label: "Qual a média mensal de pedidos de compras?", tipo: "text" },
                    { id: "media_pedidos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "requisicao_compras", label: "Existe requisição de compras formalizada?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "requisicao_compras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "cotacao", label: "É realizado processo de cotação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "cotacao_minimo", label: "Se sim, qual o mínimo de cotações exigidas?", tipo: "number" },
                    { id: "cotacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "aprovacao_compras", label: "Existe alçada de aprovação para compras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "aprovacao_compras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "pedido_compra", label: "É emitido Pedido de Compra/Ordem de Compra?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "pedido_compra_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "recebimento", label: "Existe conferência no recebimento de materiais?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "recebimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_estoque", label: "Existe integração com o estoque?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_estoque_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_financeiro", label: "Existe integração com o financeiro?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_financeiro_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "contratos_fornecedores", label: "Existe gestão de contratos com fornecedores?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "contratos_fornecedores_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Compras",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 11: CONTABILIDADE
    // ============================================================
    "contabilidade": {
        id: "contabilidade",
        titulo: "Contabilidade",
        icone: "📒",
        categoria: "administrativo",
        descricao: "Gestão contábil, lançamentos e demonstrativos",
        setor: "Contabilidade",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Contabilidade na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "contabilidade_interna", label: "A contabilidade é interna ou terceirizada?", tipo: "radio", opcoes: ["Interna", "Terceirizada"] },
                    { id: "contabilidade_interna_obs", label: "Se terceirizada, qual escritório?", tipo: "textarea", rows: 2 },
                    { id: "plano_contas", label: "Possui plano de contas definido?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "plano_contas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "centros_custo", label: "Possui estrutura de centros de custo?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "centros_custo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "lancamentos_automaticos", label: "Serão utilizados lançamentos contábeis automáticos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "lancamentos_automaticos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "balancete", label: "É gerado balancete mensal?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "balancete_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "dre", label: "É gerado DRE (Demonstração do Resultado)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "dre_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "balanco_patrimonial", label: "É gerado Balanço Patrimonial?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "balanco_patrimonial_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sped_contabil", label: "É gerado SPED Contábil?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sped_contabil_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_financeiro", label: "Existe integração com o financeiro?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_financeiro_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_folha", label: "Existe integração com a folha de pagamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_folha_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_patrimonio", label: "Existe integração com o patrimônio?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_patrimonio_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Contabilidade",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 12: FOLHA DE PAGAMENTO
    // ============================================================
    "folha_pagamento": {
        id: "folha_pagamento",
        titulo: "Folha de Pagamento",
        icone: "👷",
        categoria: "administrativo",
        descricao: "Gestão de recursos humanos e folha de pagamento",
        setor: "RH / Departamento Pessoal",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Folha de Pagamento na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_funcionarios", label: "Qual a quantidade de funcionários?", tipo: "number" },
                    { id: "qtd_funcionarios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "regime_contratacao", label: "Quais os regimes de contratação utilizados?", tipo: "checkbox", opcoes: ["CLT", "Estatutário", "Autônomo", "PJ", "Estagiário", "Jovem Aprendiz"] },
                    { id: "regime_contratacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sindicatos", label: "Existem sindicatos vinculados?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sindicatos_quais", label: "Se sim, quais?", tipo: "textarea", rows: 2 },
                    { id: "escalas_trabalho", label: "Quais as escalas de trabalho utilizadas?", tipo: "checkbox", opcoes: ["12x36", "5x2", "6x1", "Plantão", "Administrativo"] },
                    { id: "escalas_trabalho_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "beneficios", label: "Quais benefícios são oferecidos?", tipo: "checkbox", opcoes: ["Vale Transporte", "Vale Alimentação", "Vale Refeição", "Plano de Saúde", "Plano Odontológico", "Seguro de Vida"] },
                    { id: "beneficios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "esocial", label: "Já está enviando eventos para o eSocial?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "esocial_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_ponto", label: "Existe integração com o ponto eletrônico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_ponto_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_contabil", label: "Existe integração com a contabilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_contabil_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_financeiro", label: "Existe integração com o financeiro?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_financeiro_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Folha de Pagamento",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

// ... Continua na Parte 3
    // ============================================================
    // MÓDULO 13: PONTO ELETRÔNICO
    // ============================================================
    "ponto_eletronico": {
        id: "ponto_eletronico",
        titulo: "Ponto Eletrônico",
        icone: "⏰",
        categoria: "administrativo",
        descricao: "Controle de frequência e gestão de jornada",
        setor: "RH / Departamento Pessoal",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Ponto Eletrônico na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento do RH?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_relogios", label: "Quantos relógios de ponto existem?", tipo: "number" },
                    { id: "qtd_relogios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "marca_relogio", label: "Qual a marca/modelo dos relógios?", tipo: "textarea", rows: 2 },
                    { id: "tipo_registro", label: "Qual o tipo de registro utilizado?", tipo: "checkbox", opcoes: ["Biometria", "Cartão", "Senha", "Facial", "Aplicativo"] },
                    { id: "tipo_registro_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_funcionarios_ponto", label: "Quantos funcionários registram ponto?", tipo: "number" },
                    { id: "qtd_funcionarios_ponto_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "escalas_trabalho", label: "Quais as escalas de trabalho utilizadas?", tipo: "checkbox", opcoes: ["12x36", "5x2", "6x1", "Plantão", "Administrativo", "Flexível"] },
                    { id: "escalas_trabalho_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "banco_horas", label: "É utilizado banco de horas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "banco_horas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "horas_extras", label: "É realizado controle de horas extras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "horas_extras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "faltas_atrasos", label: "É realizado controle de faltas e atrasos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "faltas_atrasos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "abonos", label: "Existe rotina de abonos de ponto?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "abonos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "espelho_ponto", label: "É gerado espelho de ponto?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "espelho_ponto_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_folha", label: "Existe integração com a folha de pagamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_folha_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Ponto Eletrônico",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "relogio_ponto", label: "RELÓGIO DE PONTO" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 14: BLOCO CIRÚRGICO
    // ============================================================
    "bloco_cirurgico": {
        id: "bloco_cirurgico",
        titulo: "Bloco Cirúrgico",
        icone: "🏥",
        categoria: "assistencial",
        descricao: "Gestão de centro cirúrgico e agendamento de cirurgias",
        setor: "Centro Cirúrgico",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Bloco Cirúrgico na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_salas", label: "Quantas salas cirúrgicas existem?", tipo: "number" },
                    { id: "qtd_salas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "especialidades_cirurgicas", label: "Quais especialidades cirúrgicas são atendidas?", tipo: "textarea", rows: 4 },
                    { id: "especialidades_cirurgicas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_cirurgias", label: "Qual a média mensal de cirurgias realizadas?", tipo: "text" },
                    { id: "media_cirurgias_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_cirurgia", label: "Quais os tipos de cirurgias realizadas?", tipo: "checkbox", opcoes: ["Eletiva", "Urgência", "Emergência", "Ambulatorial"] },
                    { id: "tipos_cirurgia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "agendamento_cirurgico", label: "Como é realizado o agendamento cirúrgico?", tipo: "textarea", rows: 3 },
                    { id: "agendamento_cirurgico_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "mapa_cirurgico", label: "É gerado mapa cirúrgico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "mapa_cirurgico_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "aviso_cirurgia", label: "É utilizado aviso de cirurgia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "aviso_cirurgia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "checklist_seguranca", label: "É utilizado checklist de cirurgia segura (OMS)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "checklist_seguranca_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "descricao_cirurgica", label: "É realizada descrição cirúrgica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "descricao_cirurgica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "opme", label: "É utilizado OPME (Órteses, Próteses e Materiais Especiais)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "opme_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "consignados", label: "Trabalha com materiais consignados?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "consignados_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_cme", label: "Existe integração com a CME?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_cme_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_farmacia", label: "Existe integração com a farmácia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_farmacia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_faturamento", label: "Existe integração com o faturamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_faturamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Bloco Cirúrgico",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 15: PEP - PRONTUÁRIO ELETRÔNICO DO PACIENTE
    // ============================================================
    "pep": {
        id: "pep",
        titulo: "PEP - Prontuário Eletrônico",
        icone: "📋",
        categoria: "assistencial",
        descricao: "Prontuário Eletrônico do Paciente e registros clínicos",
        setor: "Assistencial",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução PEP na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento dos setores assistenciais?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras nos setores?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade total de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "setores_implantacao", label: "Quais setores serão contemplados na implantação do PEP?", tipo: "checkbox", opcoes: ["Pronto Socorro", "Ambulatório", "Internação", "UTI", "Centro Cirúrgico", "Obstetrícia", "Pediatria"] },
                    { id: "setores_implantacao_outros", label: "Outros setores:", tipo: "textarea", rows: 2 },
                    { id: "prontuario_atual", label: "Como é o prontuário atual?", tipo: "radio", opcoes: ["Papel", "Eletrônico", "Misto"] },
                    { id: "prontuario_atual_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "evolucao_medica", label: "Será utilizada evolução médica eletrônica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "evolucao_medica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "evolucao_enfermagem", label: "Será utilizada evolução de enfermagem eletrônica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "evolucao_enfermagem_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prescricao_medica", label: "Será utilizada prescrição médica eletrônica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prescricao_medica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prescricao_enfermagem", label: "Será utilizada prescrição de enfermagem eletrônica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prescricao_enfermagem_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sinais_vitais", label: "Será utilizado registro de sinais vitais eletrônico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sinais_vitais_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "balanco_hidrico", label: "Será utilizado balanço hídrico eletrônico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "balanco_hidrico_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "checagem_medicamentos", label: "Será utilizada checagem de medicamentos eletrônica?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "checagem_medicamentos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sae", label: "Será utilizada SAE (Sistematização da Assistência de Enfermagem)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sae_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "anamnese", label: "Será utilizada anamnese estruturada?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "anamnese_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "formularios_especificos", label: "Existem formulários específicos por especialidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "formularios_especificos_quais", label: "Se sim, quais?", tipo: "textarea", rows: 3 },
                    { id: "assinatura_digital", label: "Será utilizada assinatura digital?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "assinatura_digital_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_laboratorio", label: "Existe integração com o laboratório?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_laboratorio_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_imagem", label: "Existe integração com o setor de imagem?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_imagem_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_farmacia", label: "Existe integração com a farmácia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_farmacia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - PEP",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "notebook", label: "NOTEBOOK" },
                    { id: "tablet", label: "TABLET" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_pulseira", label: "IMPRESSORA PULSEIRA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 16: SADT - LABORATÓRIO
    // ============================================================
    "laboratorio": {
        id: "laboratorio",
        titulo: "SADT - Laboratório",
        icone: "🔬",
        categoria: "apoio",
        descricao: "Gestão de exames laboratoriais e interfaceamento",
        setor: "Laboratório",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Laboratório na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "qtd_impressoras_etiqueta", label: "Quantidade de impressoras de Etiqueta", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "setores_laboratorio", label: "Quais setores o laboratório possui?", tipo: "checkbox", opcoes: ["Bioquímica", "Hematologia", "Microbiologia", "Parasitologia", "Uroanálise", "Imunologia", "Hormonologia", "Banco de Sangue"] },
                    { id: "setores_laboratorio_obs", label: "Outros setores:", tipo: "textarea", rows: 2 },
                    { id: "media_exames", label: "Qual a média mensal de exames realizados?", tipo: "text" },
                    { id: "media_exames_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "coleta_externa", label: "Possui postos de coleta externos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "coleta_externa_qtd", label: "Se sim, quantos?", tipo: "number" },
                    { id: "laboratorio_apoio", label: "Utiliza laboratório de apoio?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "laboratorio_apoio_qual", label: "Se sim, qual?", tipo: "text" },
                    { id: "equipamentos_analisadores", label: "Listar os equipamentos analisadores (marca/modelo):", tipo: "textarea", rows: 4 },
                    { id: "equipamentos_analisadores_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "interfaceamento", label: "Será realizado interfaceamento com os equipamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "interfaceamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "protocolo_comunicacao", label: "Qual o protocolo de comunicação dos equipamentos?", tipo: "checkbox", opcoes: ["HL7", "ASTM", "Serial", "TCP/IP", "Outro"] },
                    { id: "protocolo_comunicacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "codigo_barras", label: "É utilizado código de barras nas amostras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "codigo_barras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "mapa_trabalho", label: "É gerado mapa de trabalho?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "mapa_trabalho_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "liberacao_laudos", label: "Como é realizada a liberação de laudos?", tipo: "textarea", rows: 2 },
                    { id: "liberacao_laudos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_qualidade", label: "É realizado controle de qualidade interno?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_qualidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_qualidade_externo", label: "Participa de programa de controle de qualidade externo?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_qualidade_externo_qual", label: "Se sim, qual?", tipo: "text" },
                    { id: "integracao_pep", label: "Existe integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Laboratório",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 17: SADT - IMAGEM (RIS/PACS)
    // ============================================================
    "imagem": {
        id: "imagem",
        titulo: "SADT - Imagem (RIS/PACS)",
        icone: "🩻",
        categoria: "apoio",
        descricao: "Gestão de exames de imagem, RIS e PACS",
        setor: "Diagnóstico por Imagem",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução de Imagem na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "modalidades", label: "Quais modalidades de exames são realizadas?", tipo: "checkbox", opcoes: ["Raio-X", "Tomografia", "Ressonância", "Ultrassonografia", "Mamografia", "Densitometria", "Hemodinâmica", "Ecocardiograma"] },
                    { id: "modalidades_outras", label: "Outras modalidades:", tipo: "textarea", rows: 2 },
                    { id: "media_exames", label: "Qual a média mensal de exames realizados?", tipo: "text" },
                    { id: "media_exames_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "equipamentos_imagem", label: "Listar os equipamentos de imagem (marca/modelo):", tipo: "textarea", rows: 4 },
                    { id: "equipamentos_imagem_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "pacs_atual", label: "Possui sistema PACS atualmente?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "pacs_atual_qual", label: "Se sim, qual?", tipo: "text" },
                    { id: "worklist", label: "Será utilizado Worklist (DICOM MWL)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "worklist_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "laudo_estruturado", label: "Será utilizado laudo estruturado?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "laudo_estruturado_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "telerradiologia", label: "Utiliza serviço de telerradiologia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "telerradiologia_empresa", label: "Se sim, qual empresa?", tipo: "text" },
                    { id: "gravacao_cd", label: "É realizada gravação de CD para o paciente?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "gravacao_cd_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_pep", label: "Existe integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Imagem",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "workstation", label: "WORKSTATION DIAGNÓSTICO" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "gravador_cd", label: "GRAVADOR DE CD/DVD" },
                    { id: "servidor_pacs", label: "SERVIDOR PACS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 18: CME - CENTRAL DE MATERIAL ESTERILIZADO
    // ============================================================
    "cme": {
        id: "cme",
        titulo: "CME - Central de Material Esterilizado",
        icone: "🧪",
        categoria: "apoio",
        descricao: "Gestão de materiais esterilizados e rastreabilidade",
        setor: "CME",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução CME na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "qtd_impressoras_etiqueta", label: "Quantidade de impressoras de Etiqueta", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "areas_cme", label: "Quais áreas a CME possui?", tipo: "checkbox", opcoes: ["Recepção/Expurgo", "Preparo", "Esterilização", "Armazenamento", "Distribuição"] },
                    { id: "areas_cme_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "metodos_esterilizacao", label: "Quais métodos de esterilização são utilizados?", tipo: "checkbox", opcoes: ["Autoclave Vapor", "Óxido de Etileno", "Plasma de Peróxido", "Formaldeído", "Esterilização Química"] },
                    { id: "metodos_esterilizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_autoclaves", label: "Quantas autoclaves existem?", tipo: "number" },
                    { id: "marca_autoclaves", label: "Qual a marca/modelo das autoclaves?", tipo: "textarea", rows: 2 },
                    { id: "qtd_caixas", label: "Qual a quantidade estimada de caixas cirúrgicas?", tipo: "text" },
                    { id: "qtd_caixas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rastreabilidade", label: "É realizada rastreabilidade dos materiais?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rastreabilidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "codigo_barras", label: "É utilizado código de barras nos materiais?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "codigo_barras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "indicadores_biologicos", label: "É realizado controle com indicadores biológicos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "indicadores_biologicos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "indicadores_quimicos", label: "É utilizado indicador químico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "indicadores_quimicos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_bloco", label: "Existe integração com o bloco cirúrgico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_bloco_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "consignados", label: "Recebe materiais consignados para esterilização?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "consignados_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - CME",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 19: NUTRIÇÃO / SND
    // ============================================================
    "nutricao": {
        id: "nutricao",
        titulo: "Nutrição / SND",
        icone: "🍽️",
        categoria: "apoio",
        descricao: "Gestão de dietas e serviço de nutrição",
        setor: "Nutrição",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Nutrição na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "producao_propria", label: "A produção é própria ou terceirizada?", tipo: "radio", opcoes: ["Própria", "Terceirizada", "Mista"] },
                    { id: "producao_propria_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_refeicoes", label: "Qual a média diária de refeições servidas?", tipo: "text" },
                    { id: "media_refeicoes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_refeicoes", label: "Quais tipos de refeições são servidas?", tipo: "checkbox", opcoes: ["Desjejum", "Colação", "Almoço", "Lanche", "Jantar", "Ceia"] },
                    { id: "tipos_refeicoes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_dietas", label: "Quais tipos de dietas são oferecidas?", tipo: "checkbox", opcoes: ["Normal", "Branda", "Pastosa", "Líquida", "Enteral", "Parenteral", "Especiais"] },
                    { id: "tipos_dietas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "mapa_dietas", label: "É gerado mapa de dietas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "mapa_dietas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prescricao_dietetica", label: "É utilizada prescrição dietética?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prescricao_dietetica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "avaliacao_nutricional", label: "É realizada avaliação nutricional?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "avaliacao_nutricional_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_pep", label: "Existe integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_estoque", label: "Existe integração com o estoque?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_estoque_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Nutrição",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

// ... Continua na Parte 4
    // ============================================================
    // MÓDULO 20: PATRIMÔNIO
    // ============================================================
    "patrimonio": {
        id: "patrimonio",
        titulo: "Patrimônio",
        icone: "🏷️",
        categoria: "administrativo",
        descricao: "Controle de bens patrimoniais e inventário",
        setor: "Patrimônio",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Patrimônio na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_bens", label: "Qual a quantidade estimada de bens patrimoniais?", tipo: "text" },
                    { id: "qtd_bens_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "categorias_bens", label: "Quais categorias de bens são controladas?", tipo: "checkbox", opcoes: ["Móveis", "Equipamentos Médicos", "Equipamentos de TI", "Veículos", "Imóveis", "Outros"] },
                    { id: "categorias_bens_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "plaqueta_identificacao", label: "É utilizada plaqueta de identificação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "plaqueta_identificacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "codigo_barras", label: "É utilizado código de barras/QR Code?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "codigo_barras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "inventario", label: "É realizado inventário periódico?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "inventario_periodicidade", label: "Se sim, qual a periodicidade?", tipo: "text" },
                    { id: "depreciacao", label: "É calculada depreciação dos bens?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "depreciacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "transferencia_bens", label: "Existe controle de transferência de bens entre setores?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "transferencia_bens_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "baixa_bens", label: "Existe processo de baixa de bens?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "baixa_bens_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_contabil", label: "Existe integração com a contabilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_contabil_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_compras", label: "Existe integração com o setor de compras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_compras_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Patrimônio",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" },
                    { id: "coletor_dados", label: "COLETOR DE DADOS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 21: CUSTOS
    // ============================================================
    "custos": {
        id: "custos",
        titulo: "Custos",
        icone: "📈",
        categoria: "administrativo",
        descricao: "Gestão de custos hospitalares e análise de rentabilidade",
        setor: "Controladoria / Custos",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Custos na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "metodologia_custos", label: "Qual metodologia de custos é utilizada?", tipo: "checkbox", opcoes: ["Absorção", "ABC (Custeio Baseado em Atividades)", "Variável", "Nenhuma"] },
                    { id: "metodologia_custos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "centros_custo", label: "Possui estrutura de centros de custo definida?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "centros_custo_qtd", label: "Se sim, quantos centros de custo?", tipo: "number" },
                    { id: "centros_custo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_centros", label: "Quais tipos de centros de custo existem?", tipo: "checkbox", opcoes: ["Produtivos", "Auxiliares", "Administrativos"] },
                    { id: "tipos_centros_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rateio", label: "É realizado rateio de custos indiretos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rateio_criterios", label: "Se sim, quais critérios de rateio?", tipo: "textarea", rows: 2 },
                    { id: "custo_paciente", label: "É calculado custo por paciente/atendimento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "custo_paciente_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "custo_procedimento", label: "É calculado custo por procedimento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "custo_procedimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_contabil", label: "Existe integração com a contabilidade?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_contabil_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_estoque", label: "Existe integração com o estoque?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_estoque_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_folha", label: "Existe integração com a folha de pagamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_folha_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Custos",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 22: HOTELARIA
    // ============================================================
    "hotelaria": {
        id: "hotelaria",
        titulo: "Hotelaria Hospitalar",
        icone: "🛏️",
        categoria: "apoio",
        descricao: "Gestão de leitos, higienização e rouparia",
        setor: "Hotelaria / Governança",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Hotelaria na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_leitos", label: "Qual a quantidade total de leitos?", tipo: "number" },
                    { id: "qtd_leitos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_acomodacao", label: "Quais tipos de acomodação existem?", tipo: "checkbox", opcoes: ["Enfermaria", "Apartamento", "Suíte", "UTI", "Semi-intensiva"] },
                    { id: "tipos_acomodacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_higienizacao", label: "É realizado controle de higienização de leitos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_higienizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tempo_liberacao", label: "É controlado o tempo de liberação do leito?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "tempo_liberacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_higienizacao", label: "Quais tipos de higienização são realizados?", tipo: "checkbox", opcoes: ["Concorrente", "Terminal", "Imediata"] },
                    { id: "tipos_higienizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_enxoval", label: "É realizado controle de enxoval/rouparia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_enxoval_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "lavanderia_propria", label: "Possui lavanderia própria?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "lavanderia_propria_obs", label: "Se terceirizada, qual empresa?", tipo: "textarea", rows: 2 },
                    { id: "controle_acompanhantes", label: "É realizado controle de acompanhantes?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_acompanhantes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_visitantes", label: "É realizado controle de visitantes?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_visitantes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_recepcao", label: "Existe integração com a recepção/internação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_recepcao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Hotelaria",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "tablet", label: "TABLET" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 23: MANUTENÇÃO / ENGENHARIA CLÍNICA
    // ============================================================
    "manutencao": {
        id: "manutencao",
        titulo: "Manutenção / Engenharia Clínica",
        icone: "🔧",
        categoria: "apoio",
        descricao: "Gestão de manutenção predial e equipamentos",
        setor: "Manutenção / Engenharia Clínica",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Manutenção na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipos_manutencao", label: "Quais tipos de manutenção são realizados?", tipo: "checkbox", opcoes: ["Predial", "Equipamentos Médicos", "TI", "Elétrica", "Hidráulica", "Ar Condicionado"] },
                    { id: "tipos_manutencao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "ordem_servico", label: "É utilizada ordem de serviço?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "ordem_servico_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "manutencao_preventiva", label: "É realizada manutenção preventiva?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "manutencao_preventiva_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "manutencao_corretiva", label: "É realizada manutenção corretiva?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "manutencao_corretiva_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "cronograma_preventiva", label: "Existe cronograma de manutenção preventiva?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "cronograma_preventiva_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_calibracao", label: "É realizado controle de calibração de equipamentos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_calibracao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_patrimonio", label: "Existe integração com o patrimônio?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_patrimonio_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Manutenção",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "tablet", label: "TABLET" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 24: ONCOLOGIA
    // ============================================================
    "oncologia": {
        id: "oncologia",
        titulo: "Oncologia",
        icone: "🎗️",
        categoria: "assistencial",
        descricao: "Gestão de tratamento oncológico e quimioterapia",
        setor: "Oncologia",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Oncologia na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipos_tratamento", label: "Quais tipos de tratamento são realizados?", tipo: "checkbox", opcoes: ["Quimioterapia", "Radioterapia", "Hormonioterapia", "Imunoterapia", "Terapia Alvo"] },
                    { id: "tipos_tratamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_poltronas", label: "Quantas poltronas de infusão existem?", tipo: "number" },
                    { id: "qtd_poltronas_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_pacientes", label: "Qual a média mensal de pacientes atendidos?", tipo: "text" },
                    { id: "media_pacientes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "protocolo_tratamento", label: "Utiliza protocolos de tratamento padronizados?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "protocolo_tratamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prescricao_eletronica", label: "Utiliza prescrição eletrônica de quimioterápicos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prescricao_eletronica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "farmacia_oncologica", label: "Possui farmácia oncológica própria?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "farmacia_oncologica_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "capela_fluxo_laminar", label: "Possui capela de fluxo laminar?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "capela_fluxo_laminar_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rhc", label: "Possui Registro Hospitalar de Câncer (RHC)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rhc_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sisrhc", label: "Utiliza o SisRHC?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sisrhc_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "apac_quimioterapia", label: "É faturado APAC de Quimioterapia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "apac_quimioterapia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_pep", label: "Existe integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_farmacia", label: "Existe integração com a farmácia?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_farmacia_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Oncologia",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 25: HEMOTERAPIA / BANCO DE SANGUE
    // ============================================================
    "hemoterapia": {
        id: "hemoterapia",
        titulo: "Hemoterapia / Banco de Sangue",
        icone: "🩸",
        categoria: "apoio",
        descricao: "Gestão de hemoterapia e banco de sangue",
        setor: "Hemoterapia",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Hemoterapia na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "qtd_impressoras_laser", label: "Quantidade de impressoras Laser", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipo_servico", label: "Qual o tipo de serviço de hemoterapia?", tipo: "radio", opcoes: ["Agência Transfusional", "Núcleo de Hemoterapia", "Unidade de Coleta", "Hemocentro"] },
                    { id: "tipo_servico_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "coleta_sangue", label: "É realizada coleta de sangue?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "coleta_sangue_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "processamento", label: "É realizado processamento de hemocomponentes?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "processamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "hemocomponentes", label: "Quais hemocomponentes são utilizados?", tipo: "checkbox", opcoes: ["Concentrado de Hemácias", "Plasma", "Plaquetas", "Crioprecipitado"] },
                    { id: "hemocomponentes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_transfusoes", label: "Qual a média mensal de transfusões?", tipo: "text" },
                    { id: "media_transfusoes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "testes_imunohematologicos", label: "Quais testes imunohematológicos são realizados?", tipo: "checkbox", opcoes: ["Tipagem ABO/Rh", "PAI", "Prova Cruzada", "Coombs Direto"] },
                    { id: "testes_imunohematologicos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rastreabilidade", label: "É realizada rastreabilidade das bolsas?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rastreabilidade_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "hemovida", label: "Utiliza o sistema Hemovida?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "hemovida_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "reacoes_transfusionais", label: "É realizado registro de reações transfusionais?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "reacoes_transfusionais_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_pep", label: "Existe integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Hemoterapia",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "impressora_etiqueta", label: "IMPRESSORA DE ETIQUETA" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 26: OUVIDORIA
    // ============================================================
    "ouvidoria": {
        id: "ouvidoria",
        titulo: "Ouvidoria",
        icone: "📢",
        categoria: "administrativo",
        descricao: "Gestão de manifestações e relacionamento com o cliente",
        setor: "Ouvidoria",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Ouvidoria na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "tipos_manifestacao", label: "Quais tipos de manifestação são registrados?", tipo: "checkbox", opcoes: ["Reclamação", "Sugestão", "Elogio", "Denúncia", "Solicitação"] },
                    { id: "tipos_manifestacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "canais_atendimento", label: "Quais canais de atendimento são utilizados?", tipo: "checkbox", opcoes: ["Presencial", "Telefone", "E-mail", "Site", "Formulário Físico"] },
                    { id: "canais_atendimento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "media_manifestacoes", label: "Qual a média mensal de manifestações?", tipo: "text" },
                    { id: "media_manifestacoes_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "prazo_resposta", label: "Existe prazo definido para resposta?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "prazo_resposta_qual", label: "Se sim, qual o prazo?", tipo: "text" },
                    { id: "fluxo_encaminhamento", label: "Existe fluxo de encaminhamento para os setores?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "fluxo_encaminhamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "pesquisa_satisfacao", label: "É realizada pesquisa de satisfação?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "pesquisa_satisfacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Ouvidoria",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 27: PORTAL DO PACIENTE
    // ============================================================
    "portal_paciente": {
        id: "portal_paciente",
        titulo: "Portal do Paciente",
        icone: "🌐",
        categoria: "tecnologia",
        descricao: "Portal web e aplicativo para pacientes",
        setor: "TI / Atendimento",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Portal do Paciente na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "possui_site", label: "A instituição possui site?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "possui_site_url", label: "Se sim, qual a URL?", tipo: "text" },
                    { id: "funcionalidades", label: "Quais funcionalidades serão disponibilizadas no portal?", tipo: "checkbox", opcoes: ["Agendamento Online", "Resultados de Exames", "Histórico de Atendimentos", "Dados Cadastrais", "Segunda Via de Boletos", "Telemedicina"] },
                    { id: "funcionalidades_outras", label: "Outras funcionalidades:", tipo: "textarea", rows: 2 },
                    { id: "aplicativo_mobile", label: "Será disponibilizado aplicativo mobile?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "aplicativo_mobile_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "autenticacao", label: "Como será a autenticação do paciente?", tipo: "checkbox", opcoes: ["CPF + Senha", "E-mail + Senha", "Celular + SMS", "Gov.br"] },
                    { id: "autenticacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "lgpd", label: "Existe política de privacidade definida (LGPD)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "lgpd_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_pep", label: "Existirá integração com o PEP?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_pep_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "integracao_agendamento", label: "Existirá integração com o agendamento?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "integracao_agendamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios serão necessários?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores serão acompanhados?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Portal do Paciente",
                tipo: "tabela_fixa",
                itens: [
                    { id: "servidor", label: "SERVIDOR WEB" },
                    { id: "certificado_ssl", label: "CERTIFICADO SSL" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 28: INTEGRAÇÕES
    // ============================================================
    "integracoes": {
        id: "integracoes",
        titulo: "Integrações",
        icone: "🔗",
        categoria: "tecnologia",
        descricao: "Integrações com sistemas externos",
        setor: "Tecnologia da Informação",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação de Integrações com sistemas externos na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos de integração atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor de TI",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento da TI?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sistemas_externos", label: "Quais sistemas externos precisam ser integrados?", tipo: "checkbox", opcoes: ["Laboratório (LIS)", "Imagem (RIS/PACS)", "Contabilidade", "Folha de Pagamento", "ERP Financeiro", "Prontuário Eletrônico", "BI"] },
                    { id: "sistemas_externos_outros", label: "Outros sistemas:", tipo: "textarea", rows: 3 },
                    { id: "sistemas_externos_detalhes", label: "Detalhar cada sistema (nome, fabricante, versão, contato técnico):", tipo: "textarea", rows: 5 },
                    { id: "tipo_integracao", label: "Quais tipos de integração serão utilizados?", tipo: "checkbox", opcoes: ["API REST", "Web Service SOAP", "HL7", "DICOM", "Arquivo (TXT/XML/CSV)", "Banco de Dados"] },
                    { id: "tipo_integracao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "documentacao_disponivel", label: "Existe documentação técnica dos sistemas a serem integrados?", tipo: "radio", opcoes: ["Sim", "Não", "Parcialmente"] },
                    { id: "documentacao_disponivel_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "ambiente_homologacao", label: "Existe ambiente de homologação para testes?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "ambiente_homologacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "frequencia_sincronizacao", label: "Qual a frequência de sincronização esperada?", tipo: "radio", opcoes: ["Tempo real", "A cada X minutos", "Agendado (batch)", "Sob demanda"] },
                    { id: "frequencia_sincronizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "seguranca", label: "Quais requisitos de segurança são necessários?", tipo: "checkbox", opcoes: ["VPN", "Certificado SSL", "Autenticação OAuth", "Token API"] },
                    { id: "seguranca_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "contatos_tecnicos", label: "Informar contatos técnicos dos fornecedores dos sistemas externos:", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Integrações",
                tipo: "tabela_fixa",
                itens: [
                    { id: "servidor_integracao", label: "SERVIDOR DE INTEGRAÇÃO" },
                    { id: "certificado_ssl", label: "CERTIFICADO SSL" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

// ... Continua na Parte 5
    // ============================================================
    // MÓDULO 29: SAME - ARQUIVO MÉDICO
    // ============================================================
    "same": {
        id: "same",
        titulo: "SAME - Arquivo Médico",
        icone: "📁",
        categoria: "apoio",
        descricao: "Serviço de Arquivo Médico e Estatística",
        setor: "SAME",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução SAME na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "qtd_prontuarios", label: "Qual a quantidade estimada de prontuários arquivados?", tipo: "text" },
                    { id: "qtd_prontuarios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipo_arquivo", label: "Qual o tipo de arquivo utilizado?", tipo: "radio", opcoes: ["Físico (Papel)", "Digitalizado", "Misto"] },
                    { id: "tipo_arquivo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "metodo_arquivamento", label: "Qual o método de arquivamento utilizado?", tipo: "radio", opcoes: ["Numérico Sequencial", "Terminal de Dígito", "Alfabético", "Outro"] },
                    { id: "metodo_arquivamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "controle_emprestimo", label: "É realizado controle de empréstimo de prontuários?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "controle_emprestimo_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "digitalizacao", label: "É realizada digitalização de prontuários?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "digitalizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "estatisticas", label: "São geradas estatísticas hospitalares?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "estatisticas_quais", label: "Se sim, quais?", tipo: "textarea", rows: 2 },
                    { id: "cid", label: "É realizada codificação CID?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "cid_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "comissao_revisao", label: "Existe comissão de revisão de prontuários?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "comissao_revisao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - SAME",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" },
                    { id: "scanner", label: "SCANNER" },
                    { id: "leitor_codigo_barras", label: "LEITOR CÓDIGO DE BARRAS" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 30: BI - INDICADORES E DASHBOARDS
    // ============================================================
    "bi_indicadores": {
        id: "bi_indicadores",
        titulo: "BI - Indicadores e Dashboards",
        icone: "📊",
        categoria: "tecnologia",
        descricao: "Business Intelligence e gestão de indicadores",
        setor: "Gestão / TI",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução de BI e Indicadores na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos de gestão de indicadores atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "bi_atual", label: "Possui ferramenta de BI atualmente?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "bi_atual_qual", label: "Se sim, qual ferramenta?", tipo: "text" },
                    { id: "indicadores_atuais", label: "Quais indicadores são acompanhados atualmente?", tipo: "checkbox", opcoes: ["Taxa de Ocupação", "Tempo Médio de Permanência", "Taxa de Mortalidade", "Taxa de Infecção", "Giro de Leitos", "Faturamento", "Glosas", "Produtividade"] },
                    { id: "indicadores_atuais_outros", label: "Outros indicadores:", tipo: "textarea", rows: 3 },
                    { id: "areas_dashboard", label: "Quais áreas precisam de dashboards?", tipo: "checkbox", opcoes: ["Diretoria", "Assistencial", "Financeiro", "Faturamento", "Estoque", "RH", "Qualidade"] },
                    { id: "areas_dashboard_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "frequencia_atualizacao", label: "Qual a frequência de atualização esperada?", tipo: "radio", opcoes: ["Tempo real", "Diária", "Semanal", "Mensal"] },
                    { id: "frequencia_atualizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "usuarios_bi", label: "Quantos usuários utilizarão a ferramenta de BI?", tipo: "number" },
                    { id: "usuarios_bi_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "acesso_mobile", label: "É necessário acesso mobile aos dashboards?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "acesso_mobile_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "exportacao_dados", label: "É necessária exportação de dados (Excel, PDF)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "exportacao_dados_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "alertas_automaticos", label: "São necessários alertas automáticos?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "alertas_automaticos_obs", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - BI",
                tipo: "tabela_fixa",
                itens: [
                    { id: "servidor_bi", label: "SERVIDOR BI" },
                    { id: "licencas_bi", label: "LICENÇAS BI" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    },

    // ============================================================
    // MÓDULO 31: OPERADORA DE PLANO DE SAÚDE
    // ============================================================
    "operadora_plano": {
        id: "operadora_plano",
        titulo: "Operadora de Plano de Saúde",
        icone: "🏦",
        categoria: "planos",
        descricao: "Gestão de operadora própria de plano de saúde",
        setor: "Operadora",
        objetivo: "Realizar o Diagnóstico Situacional Organizacional para implantação da solução Operadora de Plano de Saúde na instituição.",
        secoes: [
            {
                id: "profissionais_entrevistados",
                titulo: "👥 Profissionais Entrevistados",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome", tipo: "text", width: "25%" },
                    { id: "setor", label: "Setor", tipo: "text", width: "20%" },
                    { id: "cargo", label: "Cargo", tipo: "text", width: "20%" },
                    { id: "telefone", label: "Telefone", tipo: "tel", width: "15%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "20%" }
                ]
            },
            {
                id: "situacao_atual",
                titulo: "📋 Situação Atual e Fluxos de Processo",
                tipo: "campos",
                campos: [
                    { id: "descricao_processo", label: "Descrever como são realizados os processos atualmente", tipo: "textarea", rows: 5 }
                ]
            },
            {
                id: "pontos_atencao",
                titulo: "⚠️ Pontos de Atenção no Processo",
                tipo: "campos",
                campos: [
                    { id: "pontos_atencao", label: "Descrever situações observadas que podem impactar o processo de implantação", tipo: "textarea", rows: 4 }
                ]
            },
            {
                id: "matriz_raci",
                titulo: "📊 Matriz RACI",
                tipo: "campos",
                campos: [
                    { id: "responsavel", label: "Responsável", tipo: "text" },
                    { id: "aprovador", label: "Aprovador", tipo: "text" },
                    { id: "consultado", label: "Consultado", tipo: "text" },
                    { id: "informado", label: "Informado", tipo: "text" }
                ]
            },
            {
                id: "responsavel",
                titulo: "👤 Dados do Responsável pelo Setor",
                tipo: "campos",
                campos: [
                    { id: "resp_nome", label: "Nome Completo", tipo: "text" },
                    { id: "resp_cargo", label: "Cargo", tipo: "text" },
                    { id: "resp_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "resp_email", label: "E-mail", tipo: "email" },
                    { id: "resp_observacao", label: "Observação", tipo: "textarea", rows: 2 }
                ]
            },
            {
                id: "multiplicador",
                titulo: "🎓 Profissional Multiplicador",
                tipo: "campos",
                campos: [
                    { id: "mult_nome", label: "Nome Completo", tipo: "text" },
                    { id: "mult_cargo", label: "Cargo", tipo: "text" },
                    { id: "mult_telefone", label: "Telefone com DDD", tipo: "tel" },
                    { id: "mult_email", label: "E-mail", tipo: "email" }
                ]
            },
            {
                id: "colaboradores",
                titulo: "👥 Colaboradores do Setor",
                tipo: "tabela",
                colunas: [
                    { id: "nome", label: "Nome Completo", tipo: "text", width: "40%" },
                    { id: "telefone", label: "Telefone com DDD", tipo: "tel", width: "25%" },
                    { id: "email", label: "E-mail", tipo: "email", width: "35%" }
                ]
            },
            {
                id: "entrevista",
                titulo: "📝 Entrevista",
                tipo: "perguntas",
                perguntas: [
                    { id: "horario_funcionamento", label: "Horário de funcionamento?", tipo: "text" },
                    { id: "horario_funcionamento_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "possui_equipamentos", label: "Possui computadores e impressoras?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "qtd_computadores", label: "Quantidade de computadores", tipo: "number" },
                    { id: "aquisicoes_necessarias", label: "Necessidade de aquisições", tipo: "textarea", rows: 3 },
                    { id: "registro_ans", label: "Qual o número de registro na ANS?", tipo: "text" },
                    { id: "registro_ans_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipo_operadora", label: "Qual o tipo de operadora?", tipo: "radio", opcoes: ["Autogestão", "Cooperativa", "Medicina de Grupo", "Seguradora", "Filantropia"] },
                    { id: "tipo_operadora_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "qtd_beneficiarios", label: "Qual a quantidade de beneficiários?", tipo: "text" },
                    { id: "qtd_beneficiarios_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tipos_planos", label: "Quais tipos de planos são oferecidos?", tipo: "checkbox", opcoes: ["Individual", "Familiar", "Coletivo Empresarial", "Coletivo por Adesão"] },
                    { id: "tipos_planos_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "segmentacao", label: "Qual a segmentação dos planos?", tipo: "checkbox", opcoes: ["Ambulatorial", "Hospitalar", "Hospitalar com Obstetrícia", "Referência", "Odontológico"] },
                    { id: "segmentacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "rede_credenciada", label: "Possui rede credenciada?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "rede_credenciada_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "autorizacao", label: "É realizado processo de autorização?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "autorizacao_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "tiss", label: "Utiliza padrão TISS?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "tiss_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sib", label: "Envia informações para o SIB (Sistema de Informações de Beneficiários)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sib_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "sip", label: "Envia informações para o SIP (Sistema de Informações de Produtos)?", tipo: "radio", opcoes: ["Sim", "Não"] },
                    { id: "sip_obs", label: "Observação", tipo: "textarea", rows: 2 },
                    { id: "relatorios_utilizados", label: "Quais relatórios são utilizados atualmente?", tipo: "textarea", rows: 3 },
                    { id: "indicadores_utilizados", label: "Quais indicadores são utilizados atualmente?", tipo: "textarea", rows: 3 }
                ]
            },
            {
                id: "plano_aquisicao",
                titulo: "🛒 Plano de Aquisição - Operadora",
                tipo: "tabela_fixa",
                itens: [
                    { id: "computador", label: "COMPUTADOR" },
                    { id: "impressora_laser", label: "IMPRESSORA LASER" }
                ],
                colunas: ["ITEM", "QTDE EXISTENTE", "QTDE A ADQUIRIR", "DATA PREVISTA"]
            }
        ]
    }
};

// Fecha o objeto MODULOS
// ==================== FIM DA DEFINIÇÃO DE MÓDULOS ====================


// ==================== FUNÇÕES DE INICIALIZAÇÃO ====================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    prepararLogin();
});

let usuariosRegistrados = [];

function prepararLogin() {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = '';
    }

    // Verificar se já está logado
    const usuarioLogado = sessionStorage.getItem('spdataUser');
    const token = sessionStorage.getItem('spdataToken');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const currentPath = window.location.pathname.toLowerCase();

    // Se está logado, mostrar a aplicação
    if (usuarioLogado && token) {
        mostrarAplicacao();
        iniciarAplicacao();
        return;
    }

    // Se está em localhost e não logado, redirecionar para /login
    if (isLocalhost) {
        if (currentPath === '/' || currentPath === '') {
            window.location.href = '/login';
            return;
        }

        if (currentPath === '/dso') {
            window.location.href = '/login';
            return;
        }
    }

    // Se não está logado, manter na tela de login
    // (para GitHub Pages, a tela de login já está sendo exibida)
    carregarUsuarios()
        .then(() => {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    validarLogin();
                });
            }
        })
        .catch((error) => {
            console.error('Falha ao preparar login:', error);
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.textContent = 'Erro interno ao carregar credenciais. Contate o administrador.';
            }
        });
}

function carregarUsuarios() {
    // Carregar usuários do arquivo JSON
    return fetch('assets/users.json')
        .then(response => response.json())
        .then(data => {
            window.usuariosValidos = data.users || [];
            return true;
        })
        .catch(error => {
            console.warn('Não foi possível carregar usuários de assets/users.json:', error);
            // Fallback com usuários padrão
            window.usuariosValidos = [
                { username: 'ely.tavares', password: '123456' },
                { username: 'pedro.nascimento', password: '123456' },
                { username: 'marcos.almeida', password: '123456' },
                { username: 'marcus.walber', password: '123456' }
            ];
            return true;
        });
}

function validarLogin() {
    const usuario = document.getElementById('loginUser')?.value.trim();
    const senha = document.getElementById('loginPass')?.value;
    const loginError = document.getElementById('loginError');

    if (!usuario || !senha) {
        if (loginError) {
            loginError.textContent = 'Preencha usuário e senha.';
        }
        return;
    }

    // Validar credenciais localmente
    const usuarioValido = window.usuariosValidos?.find(u => u.username === usuario && u.password === senha);

    if (usuarioValido) {
        // Login bem-sucedido
        sessionStorage.setItem('spdataUser', usuario);
        sessionStorage.setItem('spdataToken', 'token-' + Date.now());

        // Limpar os campos
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        
        // Se estiver em localhost, redirecionar para /dso
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.location.href = '/dso';
        } else {
            // Se estiver em GitHub Pages, apenas mostrar a tela principal
            mostrarAplicacao();
            iniciarAplicacao();
        }
    } else {
        if (loginError) {
            loginError.textContent = 'Usuário ou senha inválidos.';
        }
    }
}

function mostrarAplicacao() {
    const loginScreen = document.getElementById('loginScreen');
    const appContent = document.getElementById('appContent');
    if (loginScreen) {
        loginScreen.classList.add('hidden');
    }
    if (appContent) {
        appContent.classList.remove('hidden');
    }
}

function iniciarAplicacao() {
    console.log('SPDATA DSO - Inicializando aplicação...');
    atualizarDataHeader();
    configurarDataProjeto();
    renderizarModulos();
    configurarFiltrosCategorias();
    carregarDadosSalvos();
    configurarAutoSave();
    configurarBotaoLogout();
    console.log('SPDATA DSO - Aplicação inicializada com sucesso!');
}

/**
 * Atualiza a data exibida no header
 */
function atualizarDataHeader() {
    const headerDate = document.getElementById('headerDate');
    if (headerDate) {
        const hoje = new Date();
        const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        headerDate.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
    }
}

/**
 * Configura o botão de logout
 */
function configurarBotaoLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

/**
 * Realiza o logout do usuário
 */
function logout() {
    // Limpar dados da sessão
    sessionStorage.removeItem('spdataUser');
    sessionStorage.removeItem('spdataToken');

    // Redirecionar para a página de login
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
        window.location.href = '/login';
        return;
    }

    // GitHub Pages: redireciona para a raiz do repositório
    const currentPath = window.location.pathname;
    const rootPath = currentPath.replace(/\/[^\/]*$/, '/') || '/';
    window.location.href = rootPath;
}

/**
 * Auto-resize para textareas para evitar cortes na impressão
 */
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    // Define a altura baseada no conteúdo total (scrollHeight)
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

/**
 * Configura a data padrão do projeto para hoje
 */
function configurarDataProjeto() {
    const inputData = document.getElementById('dataProjeto');
    if (inputData) {
        const hoje = new Date().toISOString().split('T')[0];
        inputData.value = hoje;
    }
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO DE MÓDULOS ====================

/**
 * Renderiza todos os módulos na grid
 */
function renderizarModulos() {
    const grid = document.getElementById('modulosGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.values(MODULOS).forEach(modulo => {
        const card = criarCardModulo(modulo);
        grid.appendChild(card);
    });
    
    atualizarEstatisticasBusca();
}

/**
 * Cria o card de um módulo
 */
function criarCardModulo(modulo) {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.setAttribute('data-modulo', modulo.id);
    card.setAttribute('data-categoria', modulo.categoria);
    card.onclick = () => selecionarModulo(modulo.id);
    
    card.innerHTML = `
        <div class="module-header">
            <div class="module-icon">${modulo.icone}</div>
            <div class="module-info">
                <div class="module-title">${modulo.titulo}</div>
                <span class="module-category">${formatarCategoria(modulo.categoria)}</span>
            </div>
        </div>
        <div class="module-desc">${modulo.descricao}</div>
    `;
    
    return card;
}

/**
 * Formata o nome da categoria para exibição
 */
function formatarCategoria(categoria) {
    const categorias = {
        'assistencial': 'Assistencial',
        'administrativo': 'Administrativo',
        'apoio': 'Apoio',
        'faturamento': 'Faturamento',
        'planos': 'Planos de Saúde',
        'tecnologia': 'Tecnologia'
    };
    return categorias[categoria] || categoria;
}

// ==================== FUNÇÕES DE FILTRO E BUSCA ====================

/**
 * Configura os eventos dos botões de filtro de categorias
 */
function configurarFiltrosCategorias() {
    const botoes = document.querySelectorAll('.category-btn');
    botoes.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active de todos
            botoes.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
            // Aplica filtro
            filtrarModulos();
        });
    });
}

/**
 * Filtra os módulos com base na busca e categoria selecionada
 */
function filtrarModulos() {
    const termoBusca = document.getElementById('searchModulo')?.value.toLowerCase() || '';
    const categoriaAtiva = document.querySelector('.category-btn.active')?.dataset.categoria || 'todos';
    
    const cards = document.querySelectorAll('.module-card');
    let visiveis = 0;
    
    cards.forEach(card => {
        const modulo = MODULOS[card.dataset.modulo];
        if (!modulo) return;
        
        const matchBusca = modulo.titulo.toLowerCase().includes(termoBusca) ||
                          modulo.descricao.toLowerCase().includes(termoBusca) ||
                          modulo.setor?.toLowerCase().includes(termoBusca);
        
        const matchCategoria = categoriaAtiva === 'todos' || modulo.categoria === categoriaAtiva;
        
        if (matchBusca && matchCategoria) {
            card.classList.remove('hidden');
            visiveis++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Atualiza estatísticas e mensagem de sem resultados
    atualizarEstatisticasBusca(visiveis);
    
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = visiveis === 0 ? 'block' : 'none';
    }
}

/**
 * Atualiza as estatísticas de busca
 */
function atualizarEstatisticasBusca(visiveis = null) {
    const stats = document.getElementById('searchStats');
    if (!stats) return;
    
    const total = Object.keys(MODULOS).length;
    if (visiveis === null) {
        visiveis = total;
    }
    
    stats.textContent = `Exibindo ${visiveis} de ${total} módulos`;
}

// ==================== FUNÇÕES DE SELEÇÃO DE MÓDULO ====================

/**
 * Seleciona um módulo
 */
function selecionarModulo(moduloId) {
    // Remove seleção anterior
    document.querySelectorAll('.module-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adiciona seleção no módulo clicado
    const cardSelecionado = document.querySelector(`[data-modulo="${moduloId}"]`);
    if (cardSelecionado) {
        cardSelecionado.classList.add('selected');
    }
    
    // Atualiza estado
    estadoApp.moduloSelecionado = moduloId;
    
    // Habilita botão de próximo
    const btnProximo = document.getElementById('btnIrQuestionario');
    if (btnProximo) {
        btnProximo.disabled = false;
    }
}

// ==================== FUNÇÕES DE NAVEGAÇÃO ====================

/**
 * Navega para a tela de módulos (View 2)
 */
function irParaModulos() {
    // Valida campos obrigatórios
    if (!validarIdentificacao()) {
        return;
    }
    
    // Salva dados de identificação
    salvarDadosIdentificacao();
    
    // Atualiza breadcrumb
    atualizarBreadcrumb();
    
    // Muda para view 2
    mudarView(2);
}

/**
 * Volta para a tela de identificação (View 1)
 */
function voltarParaIdentificacao() {
    mudarView(1);
}

/**
 * Navega para o questionário (View 3)
 */
function irParaQuestionario() {
    if (!estadoApp.moduloSelecionado) {
        alert('Por favor, selecione um módulo antes de continuar.');
        return;
    }
    
    // Atualiza breadcrumb
    atualizarBreadcrumb();
    
    // Renderiza o questionário
    renderizarQuestionario();
    
    // Muda para view 3
    mudarView(3);
}

/**
 * Volta para a tela de módulos (View 2)
 */
function voltarParaModulos() {
    mudarView(2);
}

/**
 * Muda a view ativa
 */
function mudarView(numeroView) {
    // Remove active de todas as views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Adiciona active na view desejada
    const viewAlvo = document.getElementById(`view${numeroView}`);
    if (viewAlvo) {
        viewAlvo.classList.add('active');
    }
    
    // Atualiza estado
    estadoApp.viewAtual = numeroView;
    
    // Controla visibilidade do breadcrumb
    const breadcrumb = document.getElementById('breadcrumbInfo');
    if (breadcrumb) {
        if (numeroView > 1) {
            breadcrumb.classList.add('visible');
        } else {
            breadcrumb.classList.remove('visible');
        }
    }
    
    // Scroll para o topo
    window.scrollTo(0, 0);
}

// ==================== FUNÇÕES DE VALIDAÇÃO ====================

/**
 * Valida os campos de identificação
 */
function validarIdentificacao() {
    const campos = [
        { id: 'codigoCliente', nome: 'Código do Cliente' },
        { id: 'nomeCliente', nome: 'Nome do Cliente' },
        { id: 'codigoProjeto', nome: 'Código do Projeto' },
        { id: 'nomeProjeto', nome: 'Nome do Projeto' },
        { id: 'dataProjeto', nome: 'Data' },
        { id: 'coordenadorProjetos', nome: 'Coordenador de Projetos' },
        { id: 'coordenadorOperacoes', nome: 'Coordenador de Operações' }
    ];
    
    for (const campo of campos) {
        const elemento = document.getElementById(campo.id);
        if (!elemento || !elemento.value.trim()) {
            alert(`Por favor, preencha o campo "${campo.nome}".`);
            if (elemento) elemento.focus();
            return false;
        }
    }
    
    return true;
}

// ==================== FUNÇÕES DE DADOS ====================

/**
 * Salva os dados de identificação no estado
 */
function salvarDadosIdentificacao() {
    estadoApp.dadosIdentificacao = {
        codigoCliente: document.getElementById('codigoCliente')?.value || '',
        nomeCliente: document.getElementById('nomeCliente')?.value || '',
        cidade: document.getElementById('cidade')?.value || '',
        uf: document.getElementById('uf')?.value || '',
        codigoProjeto: document.getElementById('codigoProjeto')?.value || '',
        nomeProjeto: document.getElementById('nomeProjeto')?.value || '',
        dataProjeto: document.getElementById('dataProjeto')?.value || '',
        coordenadorProjetos: document.getElementById('coordenadorProjetos')?.value || '',
        coordenadorOperacoes: document.getElementById('coordenadorOperacoes')?.value || ''
    };
}

/**
 * Atualiza o breadcrumb com os dados atuais
 */
function atualizarBreadcrumb() {
    const dados = estadoApp.dadosIdentificacao;
    const modulo = estadoApp.moduloSelecionado ? MODULOS[estadoApp.moduloSelecionado] : null;
    
    document.getElementById('bcCliente').textContent = dados.nomeCliente || '-';
    document.getElementById('bcProjeto').textContent = dados.nomeProjeto || '-';
    document.getElementById('bcModulo').textContent = modulo ? modulo.titulo : '-';
    document.getElementById('bcData').textContent = dados.dataProjeto ? formatarData(dados.dataProjeto) : '-';
}

/**
 * Formata uma data ISO para exibição
 */
function formatarData(dataISO) {
    if (!dataISO) return '-';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO DO QUESTIONÁRIO ====================

/**
 * Renderiza o questionário completo do módulo selecionado
 */
function renderizarQuestionario() {
    const modulo = MODULOS[estadoApp.moduloSelecionado];
    if (!modulo) return;
    
    // Atualiza título
    document.getElementById('tituloQuestionario').innerHTML = `${modulo.icone} DSO - ${modulo.titulo}`;
    document.getElementById('subtituloQuestionario').textContent = modulo.objetivo;
    
    // Renderiza conteúdo
    const container = document.getElementById('conteudoQuestionario');
    container.innerHTML = '';
    
    // Adiciona resumo dos dados do cliente
    container.appendChild(criarResumoCliente());
    
    // Renderiza cada seção
    modulo.secoes.forEach(secao => {
        const secaoElement = renderizarSecao(secao);
        container.appendChild(secaoElement);
    });
    
    // Atualiza assinatura
    atualizarAssinatura();
    
    // Inicializa galeria de imagens
    atualizarGaleriaImagens();
}

/**
 * Cria o resumo dos dados do cliente
 */
function criarResumoCliente() {
    const dados = estadoApp.dadosIdentificacao;
    const div = document.createElement('div');
    div.className = 'dados-cliente-resumo';
    div.innerHTML = `
        <h4>✅ Dados do Cliente e Projeto</h4>
        <div class="dados-grid">
            <div class="dado-item"><strong>Cliente:</strong> ${dados.nomeCliente}</div>
            <div class="dado-item"><strong>Código:</strong> ${dados.codigoCliente}</div>
            <div class="dado-item"><strong>Cidade/UF:</strong> ${dados.cidade || '-'}${dados.uf ? '/' + dados.uf : ''}</div>
            <div class="dado-item"><strong>Projeto:</strong> ${dados.nomeProjeto}</div>
            <div class="dado-item"><strong>Data:</strong> ${formatarData(dados.dataProjeto)}</div>
            <div class="dado-item"><strong>Coord. Projetos:</strong> ${dados.coordenadorProjetos}</div>
            <div class="dado-item"><strong>Coord. Operações:</strong> ${dados.coordenadorOperacoes}</div>
        </div>
    `;
    return div;
}

/**
 * Renderiza uma seção do questionário
 */
function renderizarSecao(secao) {
    const div = document.createElement('div');
    div.className = 'section';
    div.setAttribute('data-section', secao.id);
    
    let conteudo = `
        <h3 class="section-title">${secao.titulo}</h3>
        ${secao.descricao ? `<p class="section-subtitle">${secao.descricao}</p>` : ''}
    `;
    
    switch (secao.tipo) {
        case 'tabela':
            conteudo += renderizarTabela(secao);
            break;
        case 'tabela_fixa':
            conteudo += renderizarTabelaFixa(secao);
            break;
        case 'campos':
            conteudo += renderizarCampos(secao);
            break;
        case 'perguntas':
            conteudo += renderizarPerguntas(secao);
            break;
    }
    
    div.innerHTML = conteudo;
    return div;
}

/**
 * Renderiza uma tabela dinâmica
 */
function renderizarTabela(secao) {
    const tableId = `table_${secao.id}`;
    const tableClass = secao.id === 'profissionais_entrevistados' ? 'table-container table-entrevistados' : 'table-container';
    let html = `
        <div class="${tableClass}">
            <table id="${tableId}">
                <thead>
                    <tr>
                        ${secao.colunas.map(col => `<th style="width:${col.width || 'auto'}">${col.label}</th>`).join('')}
                        <th class="row-action-cell">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${criarLinhaTabela(secao)}
                </tbody>
            </table>
        </div>
        <div class="table-actions">
            <button type="button" class="btn-add-row" onclick="adicionarLinha('${secao.id}')" title="Adicionar linha">+</button>
            <span class="table-actions-label">Adicionar linha</span>
        </div>
    `;
    return html;
}

/**
 * Cria uma linha de tabela dinâmica
 */
function criarLinhaTabela(secao, index = 0) {
    const colunas = secao.colunas.map(col => {
        const inputId = `${secao.id}_${index}_${col.id}`;
        let inputHtml = '';
        
        switch (col.tipo) {
            case 'textarea':
                inputHtml = `<textarea id="${inputId}" name="${inputId}" rows="2"></textarea>`;
                break;
            case 'select':
                inputHtml = `<select id="${inputId}" name="${inputId}">
                    <option value="">Selecione...</option>
                    ${(col.opcoes || []).map(op => `<option value="${op}">${op}</option>`).join('')}
                </select>`;
                break;
            default:
                inputHtml = `<input type="${col.tipo || 'text'}" id="${inputId}" name="${inputId}" class="${col.tipo === 'email' ? 'input-email' : ''}">`;
        }
        
        return `<td class="${col.tipo === 'email' ? 'col-email' : ''}">${inputHtml}</td>`;
    }).join('');
    
    return `
        <tr data-row-index="${index}">
            ${colunas}
            <td class="row-action-cell">
                <button type="button" class="btn-remove-row-inline" onclick="removerLinha(this)" title="Remover linha">×</button>
            </td>
        </tr>
    `;
}

/**
 * Renderiza uma tabela fixa (plano de aquisição)
 */
function renderizarTabelaFixa(secao) {
    let html = `
        <div class="table-container">
            <table id="table_${secao.id}">
                <thead>
                    <tr>
                        ${secao.colunas.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${secao.itens.map((item, idx) => `
                        <tr>
                            <td><strong>${item.label}</strong></td>
                            <td><input type="number" id="${secao.id}_${item.id}_existente" min="0" value="0"></td>
                            <td><input type="number" id="${secao.id}_${item.id}_adquirir" min="0" value="0"></td>
                            <td><input type="date" id="${secao.id}_${item.id}_data"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    return html;
}

/**
 * Renderiza campos de formulário
 */
function renderizarCampos(secao) {
    let html = '<div class="form-row">';
    
    secao.campos.forEach((campo, index) => {
        if (campo.tipo === 'textarea') {
            html += `</div><div class="form-group">
                <label for="${secao.id}_${campo.id}">${campo.label}</label>
                <textarea class="form-control auto-resize" id="${secao.id}_${campo.id}" rows="${campo.rows || 3}" 
                    oninput="autoResizeTextarea(this)"></textarea>
            </div><div class="form-row">`;
        } else {
            html += `
                <div class="form-group">
                    <label for="${secao.id}_${campo.id}">${campo.label}</label>
                    <input type="${campo.tipo || 'text'}" class="form-control" id="${secao.id}_${campo.id}">
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * Renderiza perguntas do questionário
 */
function renderizarPerguntas(secao) {
    let html = '';
    
    secao.perguntas.forEach(pergunta => {
        html += `<div class="pergunta-item" data-pergunta="${pergunta.id}">`;
        html += `<label class="pergunta-label">${pergunta.label}</label>`;
        
        switch (pergunta.tipo) {
            case 'radio':
                html += `<div class="radio-group">`;
                pergunta.opcoes.forEach(opcao => {
                    const inputId = `${secao.id}_${pergunta.id}_${opcao.replace(/\s/g, '_')}`;
                    html += `
                        <label>
                            <input type="radio" name="${secao.id}_${pergunta.id}" value="${opcao}" id="${inputId}">
                            <span>${opcao}</span>
                        </label>
                    `;
                });
                html += `</div>`;
                break;
                
            case 'checkbox':
                html += `<div class="checkbox-group">`;
                pergunta.opcoes.forEach(opcao => {
                    const inputId = `${secao.id}_${pergunta.id}_${opcao.replace(/\s/g, '_')}`;
                    html += `
                        <label>
                            <input type="checkbox" name="${secao.id}_${pergunta.id}" value="${opcao}" id="${inputId}">
                            <span>${opcao}</span>
                        </label>
                    `;
                });
                html += `</div>`;
                break;
                
            case 'textarea':
                html += `<textarea class="form-control auto-resize" id="${secao.id}_${pergunta.id}" 
                    rows="${pergunta.rows || 3}" oninput="autoResizeTextarea(this)"></textarea>`;
                break;
                
            case 'number':
                html += `<input type="number" class="form-control" id="${secao.id}_${pergunta.id}" min="0" style="max-width: 150px;">`;
                break;
                
            default:
                html += `<input type="${pergunta.tipo || 'text'}" class="form-control" id="${secao.id}_${pergunta.id}">`;
        }
        
        html += `</div>`;
    });
    
    return html;
}

// ==================== FUNÇÕES DE TABELA DINÂMICA ====================

/**
 * Adiciona uma nova linha em uma tabela dinâmica
 */
function adicionarLinha(secaoId) {
    const modulo = MODULOS[estadoApp.moduloSelecionado];
    if (!modulo) return;
    
    const secao = modulo.secoes.find(s => s.id === secaoId);
    if (!secao) return;
    
    const tabela = document.getElementById(`table_${secaoId}`);
    if (!tabela) return;
    
    const tbody = tabela.querySelector('tbody');
    const novoIndex = tbody.querySelectorAll('tr').length;
    
    const novaLinha = document.createElement('tr');
    novaLinha.setAttribute('data-row-index', novoIndex);
    novaLinha.innerHTML = criarLinhaTabela(secao, novoIndex).match(/<tr[^>]*>([\s\S]*?)<\/tr>/i)[1];
    
    tbody.appendChild(novaLinha);
}

/**
 * Remove uma linha de tabela dinâmica
 */
function removerLinha(botao) {
    const linha = botao.closest('tr');
    const tbody = linha.closest('tbody');
    
    // Mantém pelo menos uma linha
    if (tbody.querySelectorAll('tr').length > 1) {
        linha.remove();
    } else {
        alert('É necessário manter pelo menos uma linha na tabela.');
    }
}

// ==================== FUNÇÕES DE ASSINATURA ====================

/**
 * Atualiza a seção de assinatura
 */
function atualizarAssinatura() {
    const dados = estadoApp.dadosIdentificacao;
    
    // Local e data
    const localData = document.getElementById('localDataAssinatura');
    if (localData) {
        const cidade = dados.cidade || '_________________';
        const uf = dados.uf || '__';
        const dataFormatada = dados.dataProjeto ? formatarDataExtenso(dados.dataProjeto) : '__ de ______________ de ____';
        localData.textContent = `${cidade}/${uf}, ${dataFormatada}`;
    }
    
    // Nome do coordenador
    const nomeAssinatura = document.getElementById('nomeAssinatura');
    if (nomeAssinatura) {
        nomeAssinatura.textContent = dados.coordenadorOperacoes || '';
    }
}

/**
 * Formata data por extenso
 */
function formatarDataExtenso(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO + 'T12:00:00');
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

// ==================== FUNÇÕES DE IMAGENS ====================

/**
 * Abre o seletor de imagens
 */
function adicionarImagem() {
    document.getElementById('fileInputImage').click();
}

/**
 * Processa as imagens selecionadas
 */
function processarImagens(files) {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            estadoApp.imagensAnexadas.push({
                id: Date.now() + Math.random(),
                nome: file.name,
                data: e.target.result,
                legenda: ''
            });
            atualizarGaleriaImagens();
        };
        reader.readAsDataURL(file);
    });
    
    // Limpa o input
    document.getElementById('fileInputImage').value = '';
}

/**
 * Atualiza a galeria de imagens
 */
function atualizarGaleriaImagens() {
    const gallery = document.getElementById('imageGallery');
    const grid = document.getElementById('galleryGrid');
    
    if (!gallery || !grid) return;
    
    if (estadoApp.imagensAnexadas.length === 0) {
        gallery.classList.remove('has-images');
        grid.innerHTML = '';
        return;
    }
    
    gallery.classList.add('has-images');
    
    grid.innerHTML = estadoApp.imagensAnexadas.map(img => `
        <div class="gallery-item" data-image-id="${img.id}">
            <img src="${img.data}" alt="${img.nome}">
            <button type="button" class="remove-image" onclick="removerImagem('${img.id}')" title="Remover imagem">×</button>
            <div class="image-caption">${img.nome}</div>
        </div>
    `).join('');
}

/**
 * Remove uma imagem da galeria
 */
function removerImagem(imageId) {
    estadoApp.imagensAnexadas = estadoApp.imagensAnexadas.filter(img => img.id != imageId);
    atualizarGaleriaImagens();
}

// ==================== FUNÇÕES DE PERSISTÊNCIA ====================

/**
 * Salva os dados do questionário
 */
function salvarDados() {
    try {
        coletarDadosQuestionario();
        
        const dadosCompletos = {
            versao: CONFIG.version,
            timestamp: new Date().toISOString(),
            identificacao: estadoApp.dadosIdentificacao,
            moduloSelecionado: estadoApp.moduloSelecionado,
            questionario: estadoApp.dadosQuestionario,
            imagens: estadoApp.imagensAnexadas
        };
        
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(dadosCompletos));
        
        alert('✅ Dados salvos com sucesso!');
        console.log('Dados salvos:', dadosCompletos);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        alert('❌ Erro ao salvar os dados. Por favor, tente novamente.');
    }
}

/**
 * Coleta os dados do questionário atual
 */
function coletarDadosQuestionario() {
    const modulo = MODULOS[estadoApp.moduloSelecionado];
    if (!modulo) return;
    
    const dados = {};
    
    modulo.secoes.forEach(secao => {
        dados[secao.id] = {};
        
        if (secao.tipo === 'tabela') {
            dados[secao.id] = coletarDadosTabela(secao);
        } else if (secao.tipo === 'tabela_fixa') {
            dados[secao.id] = coletarDadosTabelaFixa(secao);
        } else if (secao.tipo === 'campos') {
            secao.campos.forEach(campo => {
                const elemento = document.getElementById(`${secao.id}_${campo.id}`);
                if (elemento) {
                    dados[secao.id][campo.id] = elemento.value;
                }
            });
        } else if (secao.tipo === 'perguntas') {
            secao.perguntas.forEach(pergunta => {
                if (pergunta.tipo === 'radio') {
                    const selecionado = document.querySelector(`input[name="${secao.id}_${pergunta.id}"]:checked`);
                    dados[secao.id][pergunta.id] = selecionado ? selecionado.value : '';
                } else if (pergunta.tipo === 'checkbox') {
                    const checkeds = document.querySelectorAll(`input[name="${secao.id}_${pergunta.id}"]:checked`);
                    dados[secao.id][pergunta.id] = Array.from(checkeds).map(cb => cb.value);
                } else {
                    const elemento = document.getElementById(`${secao.id}_${pergunta.id}`);
                    if (elemento) {
                        dados[secao.id][pergunta.id] = elemento.value;
                    }
                }
            });
        }
    });
    
    estadoApp.dadosQuestionario = dados;
}

/**
 * Coleta dados de uma tabela dinâmica
 */
function coletarDadosTabela(secao) {
    const tabela = document.getElementById(`table_${secao.id}`);
    if (!tabela) return [];
    
    const linhas = tabela.querySelectorAll('tbody tr');
    const dados = [];
    
    linhas.forEach((linha, index) => {
        const linhaDados = {};
        secao.colunas.forEach(col => {
            const input = linha.querySelector(`[id="${secao.id}_${index}_${col.id}"]`);
            if (input) {
                linhaDados[col.id] = input.value;
            }
        });
        dados.push(linhaDados);
    });
    
    return dados;
}

/**
 * Coleta dados de uma tabela fixa
 */
function coletarDadosTabelaFixa(secao) {
    const dados = {};
    
    secao.itens.forEach(item => {
        dados[item.id] = {
            existente: document.getElementById(`${secao.id}_${item.id}_existente`)?.value || '0',
            adquirir: document.getElementById(`${secao.id}_${item.id}_adquirir`)?.value || '0',
            data: document.getElementById(`${secao.id}_${item.id}_data`)?.value || ''
        };
    });
    
    return dados;
}

/**
 * Carrega dados salvos do localStorage
 */
function carregarDadosSalvos() {
    try {
        const dadosSalvos = localStorage.getItem(CONFIG.storageKey);
        if (!dadosSalvos) return;
        
        const dados = JSON.parse(dadosSalvos);
        console.log('Dados carregados do localStorage:', dados);
        
        // Verifica se deseja continuar com os dados salvos
        if (dados.identificacao && dados.identificacao.nomeCliente) {
            const continuar = confirm(`Foram encontrados dados salvos de:\n\nCliente: ${dados.identificacao.nomeCliente}\nProjeto: ${dados.identificacao.nomeProjeto}\n\nDeseja continuar de onde parou?`);
            
            if (continuar) {
                restaurarDados(dados);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
    }
}

/**
 * Restaura os dados salvos nos campos
 */
function restaurarDados(dados) {
    // Restaura identificação
    if (dados.identificacao) {
        Object.keys(dados.identificacao).forEach(key => {
            const elemento = document.getElementById(key);
            if (elemento) {
                elemento.value = dados.identificacao[key];
            }
        });
        estadoApp.dadosIdentificacao = dados.identificacao;
    }
    
    // Restaura módulo selecionado
    if (dados.moduloSelecionado) {
        estadoApp.moduloSelecionado = dados.moduloSelecionado;
        selecionarModulo(dados.moduloSelecionado);
    }
    
    // Restaura questionário
    if (dados.questionario) {
        estadoApp.dadosQuestionario = dados.questionario;
    }
    
    // Restaura imagens
    if (dados.imagens) {
        estadoApp.imagensAnexadas = dados.imagens;
    }
}

/**
 * Configura o auto-save
 */
function configurarAutoSave() {
    setInterval(() => {
        if (estadoApp.viewAtual === 3 && estadoApp.moduloSelecionado) {
            coletarDadosQuestionario();
            
            const dadosCompletos = {
                versao: CONFIG.version,
                timestamp: new Date().toISOString(),
                identificacao: estadoApp.dadosIdentificacao,
                moduloSelecionado: estadoApp.moduloSelecionado,
                questionario: estadoApp.dadosQuestionario,
                imagens: estadoApp.imagensAnexadas
            };
            
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(dadosCompletos));
            console.log('Auto-save realizado:', new Date().toLocaleTimeString());
        }
    }, CONFIG.autoSaveInterval);
}

// ==================== FUNÇÕES DE EXPORTAÇÃO ====================

/**
 * Exporta o questionário para PDF
 */
function exportarPDF() {
    alert('📄 Preparando exportação para PDF...\n\nO documento será gerado e você poderá salvá-lo ou imprimi-lo.');
    
    // Prepara para impressão
    prepararParaImpressao();
    
    // Abre janela de impressão (salvar como PDF)
    window.print();
    
    // Restaura após impressão
    setTimeout(restaurarAposImpressao, 1000);
}

/**
 * Imprime o DSO
 */
function imprimirDSO() {
    prepararParaImpressao();
    window.print();
    setTimeout(restaurarAposImpressao, 1000);
}

/**
 * Prepara o documento para impressão
 */
function prepararParaImpressao() {
    // Marca a view 3 como ativa para impressão
    document.getElementById('view3').classList.add('print-active');
    
    // Remove campos vazios para impressão limpa
    marcarCamposVazios();
}

/**
 * Restaura o documento após impressão
 */
function restaurarAposImpressao() {
    document.getElementById('view3').classList.remove('print-active');
    desmarcarCamposVazios();
}

/**
 * Marca campos vazios para ocultação na impressão
 */
function marcarCamposVazios() {
    // Marca perguntas vazias
    document.querySelectorAll('.pergunta-item').forEach(item => {
        const inputs = item.querySelectorAll('input, textarea, select');
        let temValor = false;
        
        inputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                if (input.checked) temValor = true;
            } else if (input.value && input.value.trim()) {
                temValor = true;
            }
        });
        
        if (!temValor) {
            item.classList.add('empty-field');
        }
    });
    
    // Marca linhas de tabela vazias
    document.querySelectorAll('tbody tr').forEach(row => {
        const inputs = row.querySelectorAll('input, textarea, select');
        let temValor = false;
        
        inputs.forEach(input => {
            if (input.value && input.value.trim() && input.value !== '0') {
                temValor = true;
            }
        });
        
        if (!temValor) {
            row.classList.add('empty-row');
        }
    });
}

/**
 * Remove marcações de campos vazios
 */
function desmarcarCamposVazios() {
    document.querySelectorAll('.empty-field').forEach(el => el.classList.remove('empty-field'));
    document.querySelectorAll('.empty-row').forEach(el => el.classList.remove('empty-row'));
    document.querySelectorAll('.empty-section').forEach(el => el.classList.remove('empty-section'));
}

// ==================== FUNÇÕES UTILITÁRIAS ====================

/**
 * Auto-resize para textareas
 */
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

/**
 * Limpa todos os dados e reinicia a aplicação
 */
function limparDados() {
    if (confirm('⚠️ Tem certeza que deseja limpar todos os dados?\n\nEsta ação não pode ser desfeita.')) {
        localStorage.removeItem(CONFIG.storageKey);
        location.reload();
    }
}

// Adicione esta função ao final do seu app.js ou dentro do bloco de funções utilitárias

function aplicarMascaraTelefone(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
        
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            // Formato Celular: (XX) XXXXX-XXXX
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 5) {
            // Formato Fixo: (XX) XXXX-XXXX
            value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, "($1");
        }
        
        e.target.value = value;
    });
}

// No trecho onde você renderiza o questionário ou tabelas, 
// adicione a chamada para aplicar a máscara em campos do tipo 'tel':

// No renderizarSecao ou renderizarTabela, após inserir no DOM:
document.querySelectorAll('input[type="tel"]').forEach(input => {
    aplicarMascaraTelefone(input);
});

// ==================== EXPORTAÇÃO GLOBAL DAS FUNÇÕES ====================

// Expõe funções para uso nos eventos HTML
window.irParaModulos = irParaModulos;
window.voltarParaIdentificacao = voltarParaIdentificacao;
window.irParaQuestionario = irParaQuestionario;
window.voltarParaModulos = voltarParaModulos;
window.selecionarModulo = selecionarModulo;
window.filtrarModulos = filtrarModulos;
window.adicionarLinha = adicionarLinha;
window.removerLinha = removerLinha;
window.adicionarImagem = adicionarImagem;
window.processarImagens = processarImagens;
window.removerImagem = removerImagem;
window.salvarDados = salvarDados;
window.exportarPDF = exportarPDF;
window.imprimirDSO = imprimirDSO;
window.limparDados = limparDados;
window.autoResizeTextarea = autoResizeTextarea;

console.log('SPDATA DSO - Módulo app.js carregado. Total de módulos:', Object.keys(MODULOS).length);
