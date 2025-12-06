ALTER TABLE agendamento 
ADD COLUMN IF NOT EXISTS sintomas TEXT;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'agendamento' 
ORDER BY ordinal_position;

