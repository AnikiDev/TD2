(function() {
    function toInt(value) {
        var parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function updateLimits() {
        var programmeSelect = document.getElementById('programme');
        var valeurInput = document.getElementById('valeur');
        var nbProcessInput = document.getElementById('nb_process');
        var valeurLabel = document.getElementById('valeur-label');

        if (!programmeSelect || !valeurInput || !nbProcessInput || !valeurLabel) {
            return;
        }

        if (programmeSelect.value === 'monte_carlo') {
            valeurInput.min = '1';
            valeurInput.max = '1000000';
            valeurLabel.textContent = 'Nombre de lancers';
        } else {
            valeurInput.min = '2';
            valeurInput.max = '1000000';
            valeurLabel.textContent = 'Borne maximale (N)';
        }

        nbProcessInput.min = '1';
        nbProcessInput.max = '8';

        var valeur = toInt(valeurInput.value);
        if (valeur !== null) {
            valeurInput.value = String(clamp(valeur, Number.parseInt(valeurInput.min, 10), Number.parseInt(valeurInput.max, 10)));
        }

        var processCount = toInt(nbProcessInput.value);
        if (processCount !== null) {
            nbProcessInput.value = String(clamp(processCount, 1, 8));
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var programmeSelect = document.getElementById('programme');
        var form = document.getElementById('calcul-form');
        var indicator = document.getElementById('processing-indicator');
        if (!programmeSelect || !form) {
            return;
        }

        programmeSelect.addEventListener('change', updateLimits);
        updateLimits();

        form.addEventListener('submit', function(event) {
            if (form.dataset.submitting === 'true') {
                return;
            }

            event.preventDefault();
            form.dataset.submitting = 'true';

            if (indicator) {
                indicator.classList.add('is-visible');
            }

            var submitButton = form.querySelector('input[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }

            setTimeout(function() {
                form.submit();
            }, 1200);
        });
    });
})();
