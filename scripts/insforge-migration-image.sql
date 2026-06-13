-- Run in InsForge SQL editor if lawn_audits already exists without image_data
ALTER TABLE lawn_audits ADD COLUMN IF NOT EXISTS image_data TEXT;
