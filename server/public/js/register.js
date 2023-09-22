const form = document.querySelector("#reg-form");
const token = document.querySelector("#token");
const email = document.querySelector("#email");

const buffer = { email: email.value };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const reqHeader = new Headers();
  reqHeader.append("Content-Type", "application/json");
  reqHeader.append("Authorization", `Bearer ${token.value}`);
  const raw = JSON.stringify(buffer);
  const req = {
    method: "POST",
    headers: reqHeader,
    body: raw,
    redirect: "follow",
  };
  try {
    const res = await fetch("http://localhost:3000/api/auth/signup", req);
    if (res.status !== 201) window.alert(await res.json());
    else {
      window.alert("login successful, you will be redirect to login page");
      window.location.href = "http://localhost:4200"; //link to front end login url
    }
  } catch (err) {
    console.error(err);
  }
});

form.addEventListener("change", (e) => {
  buffer[e.target.name] = e.target.value;
});
