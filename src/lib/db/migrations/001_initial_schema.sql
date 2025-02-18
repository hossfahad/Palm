-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE client_status AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED');

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status client_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Basic Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    date_of_birth DATE,
    preferred_name VARCHAR(255),
    preferred_pronouns VARCHAR(50),
    
    -- Relationship Information
    advisor_id UUID NOT NULL,
    relationship_start_date DATE NOT NULL,
    firm_client_id VARCHAR(255),
    secondary_advisors TEXT[] DEFAULT '{}',
    relationship_manager VARCHAR(255),
    
    -- Philanthropic Profile
    cause_areas TEXT[] DEFAULT '{}'
);

-- Create index on commonly queried fields
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_advisor_id ON clients(advisor_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 