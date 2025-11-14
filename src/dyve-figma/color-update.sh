#!/bin/bash
# This script updates all color references from old red to new modern red
find components -name "*.tsx" -type f -exec sed -i 's/#FF2E2E/#FF3B5C/g; s/#cc2525/#d43550/g; s/#1A1A1A/#0F0F0F/g' {} +
