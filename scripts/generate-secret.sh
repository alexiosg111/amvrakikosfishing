#!/bin/bash

# Script to generate a secure NEXTAUTH_SECRET

echo "Generating NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32)
echo "Your NEXTAUTH_SECRET is:"
echo ""
echo "$SECRET"
echo ""
echo "Add this to your .env.local file:"
echo "NEXTAUTH_SECRET=$SECRET"
