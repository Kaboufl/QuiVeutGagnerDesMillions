# Documentation: Exécution des migrations avec Knex

## Exécution des migrations
1. Pour exécuter toutes les migrations non encore appliquées, utilisez la commande :
    ```sh
    npx knex migrate:latest
    ```

2. Pour revenir en arrière d'une migration, utilisez la commande :
    ```sh
    npx knex migrate:rollback
    ```

3. Pour vérifier l'état des migrations, utilisez la commande :
    ```sh
    npx knex migrate:status
    ```

## Bonnes pratiques
- Utilisez des noms descriptifs pour vos migrations.
- Testez vos migrations sur une base de données de développement avant de les appliquer en production.
- Gardez vos migrations sous contrôle de version (par exemple, Git).

## Conclusion
Les migrations avec Knex permettent de gérer les modifications de schéma de base de données de manière organisée et versionnée, facilitant ainsi le développement et la maintenance de votre application.

## Exécution des seeders

1. Pour exécuter les seeders et remplir la base de données avec des données initiales, utilisez la commande :
    ```sh
    npx knex seed:run
    ```

