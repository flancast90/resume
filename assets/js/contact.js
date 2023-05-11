function sendMessage() {
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // open mail client with email and message
  window.open(`mailto:finn.lancaster@finnsoftware.net?subject=Message from ${email}&body=${message}`);
}