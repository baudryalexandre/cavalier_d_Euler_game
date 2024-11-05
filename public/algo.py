# Taille de l'échiquier
N = 8

# Tous les mouvements possibles d'un cavalier dans un ordre fixe
mouvements_x = [2, 1, -1, -2, -2, -1, 1, 2]
mouvements_y = [1, 2, 2, 1, -1, -2, -2, -1]

# Initialiser le tableau de solution
solution = [[-1 for _ in range(N)] for _ in range(N)]

# Fonction pour vérifier si un mouvement est dans les limites de l'échiquier et n'a pas été visité
def est_valide(x, y):
    return 0 <= x < N and 0 <= y < N and solution[x][y] == -1

# Calculer le degré d'une case, c'est-à-dire le nombre de mouvements valides à partir de cette case
def calculer_degre(x, y):
    degre = 0
    for i in range(8):
        new_x = x + mouvements_x[i]
        new_y = y + mouvements_y[i]
        if est_valide(new_x, new_y):
            degre += 1
    return degre

# Fonction récursive pour résoudre le problème du parcours du cavalier en utilisant une logique de Warnsdorff
def resoudre_parcours_warnsdorff(x, y, movei):
    # Marquer la case actuelle avec le numéro du mouvement
    solution[x][y] = movei
    print(f"Visite : ({x}, {y}) -> Move #{movei}")

    # Si toutes les cases ont été visitées, on a une solution complète
    if movei == N * N:
        return True

    # Stocker les mouvements valides avec leur degré
    mouvements_possibles = []
    for i in range(8):
        new_x = x + mouvements_x[i]
        new_y = y + mouvements_y[i]
        if est_valide(new_x, new_y):
            degre = calculer_degre(new_x, new_y)
            mouvements_possibles.append((degre, new_x, new_y))

    # Trier les mouvements possibles par degré croissant
    mouvements_possibles.sort()  # Trie par degré en premier, puis par coordonnées en cas d'égalité

    # Essayer chaque mouvement trié
    for _, new_x, new_y in mouvements_possibles:
        print(f"Tentative de mouvement vers : ({new_x}, {new_y}) avec degré {calculer_degre(new_x, new_y)}")
        if resoudre_parcours_warnsdorff(new_x, new_y, movei + 1):
            return True
        print(f"Retour arrière depuis : ({new_x}, {new_y})")  # Backtracking

    # Si aucun mouvement valide, on revient en arrière
    solution[x][y] = -1
    print(f"Retour arrière complet de : ({x}, {y})")
    return False

# Fonction principale pour initialiser et résoudre le problème
def main(start_x, start_y):
    global solution
    solution = [[-1 for _ in range(N)] for _ in range(N)]  # Réinitialiser la grille de solution
    
    # Position de départ marquée comme "1" pour démarrer le parcours
    solution[start_x][start_y] = 1
    print(f"Début du parcours depuis : ({start_x}, {start_y})\n")
    if resoudre_parcours_warnsdorff(start_x, start_y, 1):  # Commencez à 1 pour que le premier mouvement soit "1"
        print("\n".join(str(ligne) for ligne in solution))
        return solution
    else:
        print("Aucune solution trouvée.")
        return None
