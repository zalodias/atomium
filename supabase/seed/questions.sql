-- Seed data: Chemistry trivia questions for Atomium game

-- EASY DIFFICULTY - Multiple Choice Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('Qual é a fórmula química da água?', 'multiple_choice', 'H₂O', '["H₂O", "CO₂", "NaCl", "O₂"]', 'easy'),
('Qual é o símbolo químico do oxigénio?', 'multiple_choice', 'O', '["O", "Ox", "Og", "Om"]', 'easy'),
('Quantos átomos de hidrogénio existem numa molécula de água?', 'multiple_choice', '2', '["1", "2", "3", "4"]', 'easy'),
('Qual é o símbolo químico do hidrogénio?', 'multiple_choice', 'H', '["H", "Hy", "Hi", "Hd"]', 'easy'),
('O que significa H₂ na química?', 'multiple_choice', 'Dois átomos de hidrogénio', '["Um átomo de hidrogénio", "Dois átomos de hidrogénio", "Hidrogénio líquido", "Hidrogénio sólido"]', 'easy'),
('Qual é a fórmula química do dióxido de carbono?', 'multiple_choice', 'CO₂', '["CO", "CO₂", "C₂O", "CO₃"]', 'easy'),
('Qual elemento é mais abundante no ar?', 'multiple_choice', 'Azoto (N₂)', '["Oxigénio (O₂)", "Azoto (N₂)", "Árgon (Ar)", "Dióxido de carbono (CO₂)"]', 'easy'),
('Qual é o símbolo químico do carbono?', 'multiple_choice', 'C', '["Ca", "C", "Cb", "Cr"]', 'easy');

-- EASY DIFFICULTY - True/False Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('A água é composta por hidrogénio e oxigénio.', 'true_false', 'Verdadeiro', NULL, 'easy'),
('O símbolo químico do ouro é Or.', 'true_false', 'Falso', NULL, 'easy'),
('O oxigénio é necessário para a combustão.', 'true_false', 'Verdadeiro', NULL, 'easy'),
('O hidrogénio é o elemento mais leve da tabela periódica.', 'true_false', 'Verdadeiro', NULL, 'easy'),
('A água ferve a 50°C ao nível do mar.', 'true_false', 'Falso', NULL, 'easy'),
('O CO₂ é libertado quando respiramos.', 'true_false', 'Verdadeiro', NULL, 'easy');

-- MEDIUM DIFFICULTY - Multiple Choice Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('Qual é a fórmula química da água oxigenada?', 'multiple_choice', 'H₂O₂', '["H₂O", "OH⁻", "H₂O₂", "HO₂"]', 'medium'),
('Qual é o número atómico do carbono?', 'multiple_choice', '6', '["4", "6", "8", "12"]', 'medium'),
('Quantos eletrões tem o oxigénio na camada de valência?', 'multiple_choice', '6', '["2", "4", "6", "8"]', 'medium'),
('Qual é o tipo de ligação entre os átomos de uma molécula de água?', 'multiple_choice', 'Covalente', '["Iónica", "Covalente", "Metálica", "Van der Waals"]', 'medium'),
('Qual molécula é polar?', 'multiple_choice', 'H₂O', '["O₂", "CO₂", "H₂O", "CH₄"]', 'medium'),
('O que é um isótopo?', 'multiple_choice', 'Átomos com diferente número de neutrões', '["Átomos com diferente número de protões", "Átomos com diferente número de neutrões", "Átomos com diferente número de eletrões", "Moléculas com a mesma fórmula"]', 'medium'),
('Qual é a fórmula do metano?', 'multiple_choice', 'CH₄', '["CH₃", "CH₄", "C₂H₆", "C₂H₄"]', 'medium'),
('Quantas ligações covalentes pode o carbono formar?', 'multiple_choice', '4', '["2", "3", "4", "6"]', 'medium');

-- MEDIUM DIFFICULTY - True/False Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('Os átomos de oxigénio podem fazer parte de ligações de hidrogénio.', 'true_false', 'Verdadeiro', NULL, 'medium'),
('O pH 7 representa uma solução ácida.', 'true_false', 'Falso', NULL, 'medium'),
('A molécula de CO₂ é linear.', 'true_false', 'Verdadeiro', NULL, 'medium'),
('O etanol e o metanol são isómeros.', 'true_false', 'Falso', NULL, 'medium'),
('A geometria molecular da água é angular.', 'true_false', 'Verdadeiro', NULL, 'medium'),
('O azoto é mais reativo que o oxigénio.', 'true_false', 'Falso', NULL, 'medium');

-- HARD DIFFICULTY - Multiple Choice Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('Qual é a hibridização do carbono no metano (CH₄)?', 'multiple_choice', 'sp³', '["sp", "sp²", "sp³", "sp³d"]', 'hard'),
('Qual é o ângulo de ligação aproximado na molécula de água?', 'multiple_choice', '104.5°', '["90°", "104.5°", "109.5°", "120°"]', 'hard'),
('Qual é a entropia padrão da formação de água (aproximadamente)?', 'multiple_choice', '-286 kJ/mol', '["-286 kJ/mol", "-186 kJ/mol", "+286 kJ/mol", "0 kJ/mol"]', 'hard'),
('Qual é a configuração eletrónica do oxigénio?', 'multiple_choice', '1s² 2s² 2p⁴', '["1s² 2s² 2p²", "1s² 2s² 2p⁴", "1s² 2s² 2p⁶", "1s² 2p⁶"]', 'hard'),
('Qual é o nome IUPAC do CH₃CH₂OH?', 'multiple_choice', 'Etanol', '["Metanol", "Etanol", "Propanol", "Butanol"]', 'hard'),
('Qual é o número de oxidação do carbono no CO₂?', 'multiple_choice', '+4', '["-4", "0", "+2", "+4"]', 'hard'),
('Qual é a constante de Avogadro?', 'multiple_choice', '6.022 × 10²³', '["3.14 × 10²³", "6.022 × 10²³", "6.022 × 10²²", "1.602 × 10⁻¹⁹"]', 'hard'),
('Qual é a massa molar da água?', 'multiple_choice', '18 g/mol', '["16 g/mol", "17 g/mol", "18 g/mol", "20 g/mol"]', 'hard');

-- HARD DIFFICULTY - True/False Questions
INSERT INTO questions (text, type, answer, options, difficulty) VALUES
('A energia de ionização do hélio é maior que a do hidrogénio.', 'true_false', 'Verdadeiro', NULL, 'hard'),
('O benzeno tem ligações duplas localizadas.', 'true_false', 'Falso', NULL, 'hard'),
('A ligação tripla no N₂ é mais forte que a ligação dupla no O₂.', 'true_false', 'Verdadeiro', NULL, 'hard'),
('O momento dipolar do CO₂ é zero.', 'true_false', 'Verdadeiro', NULL, 'hard'),
('A teoria VSEPR pode prever a geometria molecular.', 'true_false', 'Verdadeiro', NULL, 'hard'),
('O ponto de ebulição do H₂S é maior que o da H₂O.', 'true_false', 'Falso', NULL, 'hard');
