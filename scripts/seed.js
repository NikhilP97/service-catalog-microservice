/**
 * @fileoverview Database seed script to populate data for a new project
 * Creates tables and inserts data defined in the .sql file
 * If table and data already exists, does not do anything
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function runSeedScript() {
    const client = new Client({
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || 'postgres_user',
        password: process.env.PG_PASSWORD || 'postgres_password',
        database: process.env.PG_DB || 'service_catalog_pgdb',
    });

    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to the database.');

        // Read the SQL file
        const sqlPath = path.join(__dirname, 'db-seed.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the SQL file
        await client.query(sql);
        console.log('Seed script executed successfully.');
    } catch (error) {
        console.error('Error executing seed script:', error.message);
    } finally {
        // Close the database connection
        await client.end();
        console.log('Database connection closed.');
    }
}

runSeedScript();
