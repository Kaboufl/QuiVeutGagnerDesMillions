import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("questions").del();

    // Inserts seed entries
    await knex("questions").insert([
        {
            id: 1,
            question: "Quelle est la capitale de la France ?",
            answer1: "Paris",
            answer2: "Londres",
            answer3: "Madrid",
            answer4: "Berlin",
            correct_answer: 1
        },
        {
            id: 2,
            question: "Quel protocole permet la communication textuelle sur Internet ?",
            answer1: "HTTP",
            answer2: "FTP",
            answer3: "SMTP",
            answer4: "IRC",
            correct_answer: 4
        },
        {
            id: 3,
            question: "Quel est le système permettant de convertir une URL en adresse IP ?",
            answer1: "DNS",
            answer2: "DHCP",
            answer3: "FTP",
            answer4: "HTTP",
            correct_answer: 1
        },
        {
            id: 4,
            question: "Quel est le nom du protocole de transfert de courriels ?",
            answer1: "SMTP",
            answer2: "POP",
            answer3: "IMAP",
            answer4: "HTTP",
            correct_answer: 1
        },
        {
            id: 5,
            question: "Quel est le nom du protocole de transfert de fichiers ?",
            answer1: "FTP",
            answer2: "HTTP",
            answer3: "SMTP",
            answer4: "POP",
            correct_answer: 1
        },
        {
            id: 6,
            question: "Quel est ne nom du protocole permettant d'administrer un serveur à distance ?",
            answer1: "SSH",
            answer2: "FTP",
            answer3: "HTTP",
            answer4: "SMTP",
            correct_answer: 1
        }
    ]);
};
