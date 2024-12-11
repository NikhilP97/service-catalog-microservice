-- Check and create the services table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN
        CREATE TABLE services (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            deleted_at TIMESTAMP NULL
        );
    END IF;
END $$;

-- Check and create the versions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'versions') THEN
        CREATE TABLE versions (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            overview TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            deleted_at TIMESTAMP NULL,
            service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- Insert seed data into the services table
INSERT INTO services (id, name, description, created_at, updated_at)
VALUES
    ('901a65cb-7194-44a6-9b12-2316be8a3c88', 'Contact Us', 'Description for Contact Us', NOW(), NOW()),
    ('6203c80f-d830-4378-9140-6fa6c2f79008', 'Notifications', 'Description for Notifications', NOW(), NOW()),
    ('a99348f9-c27d-49ab-b025-e168b58cf446', 'Security', 'Description for Security', NOW(), NOW()),
    ('ee6a7068-d925-4573-a5da-cfda5f9ec28b', 'Reporting', 'Description for Reporting', NOW(), NOW()),
    ('be1d3aa3-76f4-4e54-b546-9166b098c742', 'Billing', 'Description for Billing', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert seed data into the versions table
INSERT INTO versions (id, name, overview, created_at, updated_at, service_id)
VALUES
    ('b0d9da4f-57e7-4c1b-8914-e694a366fea4', 'v1.0', 'Initial version of Contact Us', NOW(), NOW(), '901a65cb-7194-44a6-9b12-2316be8a3c88'),
    ('67747a83-18a6-4056-b44a-c79eda2458a2', 'v1.1', 'Minor update to Contact Us', NOW(), NOW(), '901a65cb-7194-44a6-9b12-2316be8a3c88'),
    ('b921486a-e14f-45e6-8cb1-20a66855d786', 'v2.0', 'Major update to Contact Us', NOW(), NOW(), '901a65cb-7194-44a6-9b12-2316be8a3c88'),
    ('4a1dc7d5-caa6-4db8-83f5-69b997d2a0f6', 'v1.0', 'Initial version of Notifications', NOW(), NOW(), '6203c80f-d830-4378-9140-6fa6c2f79008'),
    ('1256eeb6-d221-483e-bca0-9108f3a31f47', 'v1.1', 'Minor update to Notifications', NOW(), NOW(), '6203c80f-d830-4378-9140-6fa6c2f79008'),
    ('69d76a1c-defc-41af-bf86-7dbc3b2d35e3', 'v1.0', 'Initial version of Security', NOW(), NOW(), 'a99348f9-c27d-49ab-b025-e168b58cf446'),
    ('ac780a28-2564-4ad0-b248-5aecb24f4097', 'v1.1', 'Minor update to Security', NOW(), NOW(), 'a99348f9-c27d-49ab-b025-e168b58cf446'),
    ('ee44e12d-2a32-4e2e-8e94-a87e39e4959c', 'v1.0', 'Initial version of Reporting', NOW(), NOW(), 'ee6a7068-d925-4573-a5da-cfda5f9ec28b'),
    ('2e560314-d3d8-467c-8e7d-f425bf8a848a', 'v1.0', 'Initial version of Billing', NOW(), NOW(), 'be1d3aa3-76f4-4e54-b546-9166b098c742'),
    ('f8ce0e25-ee0a-4e86-b772-c5a718719bb4', 'v1.1', 'Minor update to Billing', NOW(), NOW(), 'be1d3aa3-76f4-4e54-b546-9166b098c742')
ON CONFLICT (id) DO NOTHING;
