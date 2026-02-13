# Script de Nettoyage Automatique du Projet
# Supprime tous les fichiers inutiles identifiés dans l'audit

Write-Host "🧹 NETTOYAGE DU PROJET - GESTION CLINIQUE" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
$filesDeleted = 0
$spaceFreed = 0

# Fonction pour supprimer un fichier avec confirmation
function Remove-FileIfExists {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    $fullPath = Join-Path $rootPath $FilePath
    
    if (Test-Path $fullPath) {
        $fileSize = (Get-Item $fullPath).Length
        Write-Host "🗑️  Suppression: $Description" -ForegroundColor Yellow
        Write-Host "   Fichier: $FilePath" -ForegroundColor Gray
        
        try {
            Remove-Item $fullPath -Force
            $script:filesDeleted++
            $script:spaceFreed += $fileSize
            Write-Host "   ✅ Supprimé ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "⏭️  Ignoré (déjà supprimé): $FilePath" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "📋 PHASE 1: Suppression des fichiers de logs" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "hs_err_pid28256.log" "Crashlog JVM #1"
Remove-FileIfExists "hs_err_pid35636.log" "Crashlog JVM #2"
Remove-FileIfExists "replay_pid28256.log" "Replay log JVM"

Write-Host "📋 PHASE 2: Suppression des fichiers de test" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "react\src\composants\TestBarreHorizontal.jsx" "Composant de test"

Write-Host "📋 PHASE 3: Suppression des fichiers CSS vides" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta
Write-Host ""

Remove-FileIfExists "react\src\App.css" "Fichier CSS vide"

Write-Host "📋 PHASE 4: Consolidation de la documentation" -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""

# Dark Mode (garder seulement 1)
Remove-FileIfExists "DARK_MODE_CORRECTION_PLAN.md" "Doc Dark Mode - Plan de correction"
Remove-FileIfExists "DARK_MODE_DOCUMENTATION.md" "Doc Dark Mode - Documentation"
Remove-FileIfExists "DARK_MODE_EXAMPLES.md" "Doc Dark Mode - Exemples"
Remove-FileIfExists "DARK_MODE_PROGRESS.md" "Doc Dark Mode - Progrès"
Remove-FileIfExists "DARK_MODE_VALIDATION_FINALE.md" "Doc Dark Mode - Validation"
Remove-FileIfExists "MODE_SOMBRE_RESUME_FINAL.md" "Doc Dark Mode - Résumé"
Remove-FileIfExists "VERIFICATION_DARK_MODE.md" "Doc Dark Mode - Vérification"

# Sessions (garder seulement le complet)
Remove-FileIfExists "RESUME_SESSION_2026-01-04.md" "Résumé de session (doublon)"

# Tests (garder seulement 1)
Remove-FileIfExists "TESTING.md" "Doc Tests - Guide général"
Remove-FileIfExists "TEST_COVERAGE_100_PLAN.md" "Doc Tests - Plan de couverture"
Remove-FileIfExists "TEST_REPORT.md" "Doc Tests - Rapport"
Remove-FileIfExists "FINAL_TEST_REPORT.md" "Doc Tests - Rapport final"

# UX (garder seulement 1)
Remove-FileIfExists "AUDIT_UX_AMELIORATIONS.md" "Doc UX - Audit"
Remove-FileIfExists "CHARTE_GRAPHIQUE_COMPLETE.md" "Doc UX - Charte graphique"
Remove-FileIfExists "RAPPORT_FINAL_AMELIORATIONS_UX.md" "Doc UX - Rapport final"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ NETTOYAGE TERMINÉ" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Statistiques:" -ForegroundColor Yellow
Write-Host "   • Fichiers supprimés: $filesDeleted" -ForegroundColor White
Write-Host "   • Espace libéré: $([math]::Round($spaceFreed/1MB, 2)) MB" -ForegroundColor White
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Vérifier que le projet compile toujours" -ForegroundColor White
Write-Host "   2. Remplacer les console.log par le nouveau logger" -ForegroundColor White
Write-Host "   3. Mettre à jour .gitignore" -ForegroundColor White
Write-Host "   4. Commit les changements" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Pour plus de détails, consultez: AUDIT_CLEAN_CODE_SENIOR.md" -ForegroundColor Cyan
Write-Host ""
