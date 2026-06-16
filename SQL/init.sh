#!/bin/bash
set -e

echo "Creating database db_klinik with utf8mb4..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "
  CREATE DATABASE IF NOT EXISTS db_klinik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"

echo "Creating database sik with latin1..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "
  CREATE DATABASE IF NOT EXISTS sik CHARACTER SET latin1 COLLATE latin1_swedish_ci;
"

echo "Importing db_klinik.sql..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" db_klinik < /sql/db_klinik.sql

echo "Importing sik.sql..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" --default-character-set=latin1 sik < /sql/sik.sql

echo "Done."
