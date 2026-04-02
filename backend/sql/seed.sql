INSERT INTO users (full_name, email, password_hash, role)
VALUES
    ('System Admin', 'admin@qualitrack.local', '$2b$10$replace-with-real-hash', 'Admin'),
    ('Quality Inspector', 'inspector@qualitrack.local', '$2b$10$replace-with-real-hash', 'QC')
ON CONFLICT (email) DO NOTHING;

INSERT INTO suppliers (name, contact_name, contact_email, contact_phone)
VALUES
    ('Precision Components Ltd', 'A. Ncube', 'supply@precision-components.com', '+27 11 555 0199'),
    ('Northline Electronics', 'M. Khumalo', 'orders@northline-electronics.com', '+27 10 555 0123')
ON CONFLICT DO NOTHING;

INSERT INTO parts (part_number, description, unit_of_measure)
VALUES
    ('PCB-CTRL-001', 'Main controller PCB', 'pcs'),
    ('CAB-ASSY-004', 'Power cable assembly', 'pcs')
ON CONFLICT (part_number) DO NOTHING;
