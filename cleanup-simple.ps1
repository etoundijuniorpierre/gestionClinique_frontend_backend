# Script de Nettoyage Automatique - Version Simple
# Supprime tous les fichiers inutiles identifies dans l'audit

Write-Host "Nettoyage du Projet - Gestion Clinique" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
$filesDeleted = 0
$spaceFreed = 0

# Fonction pour supprimer un fichier
function Remove-FileIfExists {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    $fullPath = Join-Path $rootPath $FilePath
    
    if (Test-Path $fullPath) {
        $fileSize = (Get-Item $fullPath).Length
        Write-Host "Suppression: $Description" -ForegroundColor Yellow
        Write-Host "  Fichier: $FilePath" -ForegroundColor Gray
        
        try {
            Remove-Item $fullPath -Force
            $script:filesDeleted++
            $script:spaceFreed += $fileSize
            $sizeMB = [math]::Round($fileSize / 1MB, 2)
            Write-Host "  OK - $sizeMB MB" -ForegroundColor Green
        }
        catch {
            Write-Host "  ERREUR: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Ignore (deja supprime): $FilePath" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "PHASE 1: Suppression des fichiers de logs" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "hs_err_pid28256.log" "Crashlog JVM 1"
Remove-FileIfExists "hs_err_pid35636.log" "Crashlog JVM 2"
Remove-FileIfExists "replay_pid28256.log" "Replay log JVM"

Write-Host "PHASE 2: Suppression des fichiers de test" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "react\src\composants\TestBarreHorizontal.jsx" "Composant de test"

Write-Host "PHASE 3: Suppression des fichiers CSS vides" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "react\src\App.css" "Fichier CSS vide"

Write-Host "PHASE 4: Consolidation de la documentation" -ForegroundColor Magenta
Write-Host ""

# Dark Mode (garder seulement 1)
Remove-FileIfExists "DARK_MODE_CORRECTION_PLAN.md" "Doc Dark Mode - Plan"
Remove-FileIfExists "DARK_MODE_DOCUMENTATION.md" "Doc Dark Mode - Documentation"
Remove-FileIfExists "DARK_MODE_EXAMPLES.md" "Doc Dark Mode - Exemples"
Remove-FileIfExists "DARK_MODE_PROGRESS.md" "Doc Dark Mode - Progres"
Remove-FileIfExists "DARK_MODE_VALIDATION_FINALE.md" "Doc Dark Mode - Validation"
Remove-FileIfExists "MODE_SOMBRE_RESUME_FINAL.md" "Doc Dark Mode - Resume"
Remove-FileIfExists "VERIFICATION_DARK_MODE.md" "Doc Dark Mode - Verification"

# Sessions (garder seulement le complet)
Remove-FileIfExists "RESUME_SESSION_2026-01-04.md" "Resume de session (doublon)"

# Tests (garder seulement 1)
Remove-FileIfExists "TESTING.md" "Doc Tests - Guide general"
Remove-FileIfExists "TEST_COVERAGE_100_PLAN.md" "Doc Tests - Plan de couverture"
Remove-FileIfExists "TEST_REPORT.md" "Doc Tests - Rapport"
Remove-FileIfExists "FINAL_TEST_REPORT.md" "Doc Tests - Rapport final"

# UX (garder seulement 1)
Remove-FileIfExists "AUDIT_UX_AMELIORATIONS.md" "Doc UX - Audit"
Remove-FileIfExists "CHARTE_GRAPHIQUE_COMPLETE.md" "Doc UX - Charte graphique"
Remove-FileIfExists "RAPPORT_FINAL_AMELIORATIONS_UX.md" "Doc UX - Rapport final"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "NETTOYAGE TERMINE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Statistiques:" -ForegroundColor Yellow
Write-Host "  Fichiers supprimes: $filesDeleted" -ForegroundColor White
$spaceMB = [math]::Round($spaceFreed / 1MB, 2)
Write-Host "  Espace libere: $spaceMB MB" -ForegroundColor White
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "  1. Verifier que le projet compile toujours" -ForegroundColor White
Write-Host "  2. Tester le dark mode" -ForegroundColor White
Write-Host "  3. Commit les changements" -ForegroundColor White
Write-Host ""
