package main

import (
    // "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
    "os/exec"
    "strings"
)

func main() {
    // Servir les fichiers statiques
    http.Handle("/", http.FileServer(http.Dir("./public")))

    // Route pour récupérer les mots bannis
    http.HandleFunc("/banned-words", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
            return
        }

        // Lire le fichier banned_words.txt
        data, err := ioutil.ReadFile("banned_words.txt")
        if err != nil {
            http.Error(w, "Erreur de lecture du fichier", http.StatusInternalServerError)
            return
        }

        // Envoyer les mots bannis en réponse
        bannedWords := strings.Split(string(data), "\n")
        for i := range bannedWords {
            bannedWords[i] = strings.TrimSpace(bannedWords[i])
        }

        // Répondre avec le JSON
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte("[\"" + strings.Join(bannedWords, "\", \"") + "\"]"))
    })

    // Route pour résoudre le problème du cavalier
    http.HandleFunc("/solve-knight-tour", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
            return
        }

        // Exécuter le script Python pour résoudre le problème du cavalier
        cmd := exec.Command("python3", "algo.py")
        output, err := cmd.Output()
        if err != nil {
            log.Printf("Erreur lors de l'exécution du script Python : %v", err)
            http.Error(w, "Erreur lors de l'exécution du script", http.StatusInternalServerError)
            return
        }

        // Traiter la sortie JSON du script Python
        w.Header().Set("Content-Type", "application/json")
        w.Write(output)
    })

    // Démarrer le serveur
    port := ":3000"
    log.Println("Serveur en cours d'exécution sur http://localhost" + port)
    err := http.ListenAndServe(port, nil)
    if err != nil {
        log.Fatal(err)
    }
}
