function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';}

window.addEventListener('load', function() {
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
      if (!options.isActivated.checked) { ghost(true); }

  options.isActivated.onchange = function() {
    localStorage.isActivated = options.isActivated.checked;
    ghost(!options.isActivated.checked);
  };
});