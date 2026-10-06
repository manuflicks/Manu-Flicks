(function () {
  "use strict";

  var EMAIL = "manueligbarroso@gmail.com";
  var PHONE = "+13055000381";
  var PLANS = {
    basic: { name: "Basic", price: 40 },
    premium: { name: "Premium", price: 60 },
    elite: { name: "Elite", price: 160 }
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Footer year */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile nav */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
    });
  }

  /* Lightbox */
  var lightbox = $("#lightbox");
  var thumbs = $$(".gallery button");
  if (lightbox && thumbs.length && typeof lightbox.showModal === "function") {
    var lbImg = $("#lb-img");
    var lbCount = $("#lb-count");
    var current = 0;
    var show = function (i) {
      current = (i + thumbs.length) % thumbs.length;
      var src = $("img", thumbs[current]);
      lbImg.src = src.getAttribute("src");
      lbImg.alt = src.getAttribute("alt");
      lbCount.textContent = (current + 1) + " / " + thumbs.length;
    };
    thumbs.forEach(function (btn, i) {
      btn.addEventListener("click", function () { show(i); lightbox.showModal(); });
    });
    $("#lb-prev").addEventListener("click", function () { show(current - 1); });
    $("#lb-next").addEventListener("click", function () { show(current + 1); });
    $("#lb-close").addEventListener("click", function () { lightbox.close(); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lb-inner")) lightbox.close();
    });
    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    lightbox.addEventListener("close", function () { thumbs[current].focus(); });
  }

  /* Booking form */
  var form = $("#book-form");
  if (!form) return;

  var f = {
    sport: $("#sport"), date: $("#date"), location: $("#location"),
    athlete: $("#athlete"), name: $("#name"), notes: $("#notes")
  };
  var status = $("#form-status");

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var isoLocal = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var tomorrow = function () { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 1); return d; };
  f.date.min = isoLocal(tomorrow());

  var parseDate = function (v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  var prettyDate = function (v) {
    var d = parseDate(v);
    return d ? d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
  };
  var selectedPlan = function () {
    var r = $('input[name="plan"]:checked', form);
    return r ? r.value : "";
  };
  var needsAthlete = function () { var p = selectedPlan(); return p === "premium" || p === "elite"; };

  var athleteField = $("#athlete-field");
  var priceEl = $("#sum-price");
  var updateForm = function () {
    var p = PLANS[selectedPlan()];
    priceEl.textContent = p ? "$" + p.price : "Choose a plan";
    priceEl.classList.toggle("empty", !p);
    $("#date-label").textContent = selectedPlan() === "elite" ? "First game date" : "Game date";
    athleteField.hidden = !needsAthlete();
  };

  var setError = function (key, msg, input) {
    $("#err-" + key).textContent = msg || "";
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  var validate = function () {
    var errors = [];
    var check = function (key, input, msg) {
      setError(key, msg, input);
      if (msg) errors.push(input || $('input[name="plan"]', form));
    };
    check("plan", null, selectedPlan() ? "" : "Choose a plan.");
    check("sport", f.sport, f.sport.value.trim() ? "" : "Enter the sport.");
    var d = parseDate(f.date.value);
    var dateMsg = "";
    if (!d) dateMsg = "Choose the game date.";
    else if (d < tomorrow()) dateMsg = "Bookings need at least 1 day of notice. Choose tomorrow or later.";
    check("date", f.date, dateMsg);
    check("location", f.location, f.location.value.trim() ? "" : "Enter where the game is.");
    check("athlete", f.athlete, needsAthlete() && !f.athlete.value.trim() ? "Enter the athlete's name and number." : "");
    check("name", f.name, f.name.value.trim() ? "" : "Enter your name.");
    return errors;
  };

  var buildMessage = function () {
    var p = PLANS[selectedPlan()];
    var lines = [
      "Hi, I'd like to book coverage.",
      "",
      "Plan: " + p.name + " ($" + p.price + ")",
      "Sport: " + f.sport.value.trim(),
      (selectedPlan() === "elite" ? "First game date: " : "Date: ") + prettyDate(f.date.value)
    ];
    lines.push("Location: " + f.location.value.trim());
    if (needsAthlete()) lines.push("Athlete: " + f.athlete.value.trim());
    lines.push("", "Name: " + f.name.value.trim());
    if (f.notes.value.trim()) lines.push("", "Note: " + f.notes.value.trim());
    return lines;
  };

  form.addEventListener("input", function () {
    updateForm();
    if (status.classList.contains("is-error")) { validate(); }
  });
  form.addEventListener("change", updateForm);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errors = validate();
    if (errors.length) {
      status.className = "form-status is-error";
      status.textContent = "Please fix the " + (errors.length === 1 ? "highlighted field" : errors.length + " highlighted fields") + " below.";
      errors[0].focus();
      return;
    }
    var via = e.submitter && e.submitter.getAttribute("data-send") === "text" ? "text" : "email";
    var lines = buildMessage();
    var p = PLANS[selectedPlan()];
    var url;
    if (via === "text") {
      url = "sms:" + PHONE + "?&body=" + encodeURIComponent(lines.join("\n"));
    } else {
      var subject = "Coverage request: " + p.name + ", " + f.sport.value.trim() + ", " + prettyDate(f.date.value);
      url = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\r\n"));
    }
    var to = via === "text" ? "305-500-0381" : EMAIL;
    status.className = "form-status is-ok";
    status.textContent = "Your " + (via === "text" ? "messages" : "email") + " app should open with your request filled in. Press send there to finish. If it didn't open, copy your request and send it to " + to + ".";
    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-small";
    copyBtn.textContent = "Copy request";
    copyBtn.addEventListener("click", function () {
      var text = lines.join("\n");
      var fallback = function () {
        var box = $("textarea", status) || status.appendChild(document.createElement("textarea"));
        box.readOnly = true;
        box.value = text;
        box.setAttribute("aria-label", "Your request");
        box.focus();
        box.select();
        copyBtn.textContent = "Select the text and copy it";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { copyBtn.textContent = "Copied"; }, fallback);
      } else {
        fallback();
      }
    });
    status.appendChild(document.createElement("br"));
    status.appendChild(copyBtn);
    window.location.href = url;
  });

  /* Choose a plan from a card or from the finder */
  var choosePlan = function (plan) {
    var radio = $('input[name="plan"][value="' + plan + '"]', form);
    if (!radio) return;
    radio.checked = true;
    setError("plan", "");
    updateForm();
    $("#book").scrollIntoView({ block: "start" });
    var firstEmpty = [f.sport, f.date, f.location, f.name].filter(function (el) { return !el.value; })[0] || f.sport;
    firstEmpty.focus({ preventScroll: true });
  };
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-choose]");
    if (btn) choosePlan(btn.getAttribute("data-choose"));
  });

  /* Plan finder */
  var q1 = $("#finder-q1"), q2 = $("#finder-q2"), result = $("#finder-result"), reset = $("#finder-reset");
  if (q1 && q2 && result && reset) {
    var press = function (group, btn) {
      $$(".choice", group).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    };
    var copy = {
      basic: "Basic fits best. It covers one game with 20 to 30 edited action photos.",
      premium: "Premium fits best. It follows one athlete with 30 to 40 photos, portraits and a 30-second highlight video.",
      elite: "Elite fits best. It covers a whole tournament with 75 to 100+ photos and a full highlight video."
    };
    var recommend = function (plan) {
      $$(".plan").forEach(function (card) { card.classList.toggle("is-match", card.getAttribute("data-plan") === plan); });
      result.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = copy[plan];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-small";
      b.setAttribute("data-choose", plan);
      b.textContent = "Book " + PLANS[plan].name + " ($" + PLANS[plan].price + ")";
      result.appendChild(p);
      result.appendChild(b);
      result.hidden = false;
      reset.hidden = false;
    };
    $$("[data-q1]", q1).forEach(function (btn) {
      btn.addEventListener("click", function () {
        press(q1, btn);
        if (btn.getAttribute("data-q1") === "tournament") {
          q2.hidden = true;
          press(q2, null);
          recommend("elite");
        } else {
          q2.hidden = false;
          result.hidden = true;
          reset.hidden = false;
          $$(".plan").forEach(function (card) { card.classList.remove("is-match"); });
          $(".choice", q2).focus();
        }
      });
    });
    $$("[data-q2]", q2).forEach(function (btn) {
      btn.addEventListener("click", function () {
        press(q2, btn);
        recommend(btn.getAttribute("data-q2") === "yes" ? "premium" : "basic");
      });
    });
    reset.addEventListener("click", function () {
      press(q1, null); press(q2, null);
      q2.hidden = true; result.hidden = true; reset.hidden = true;
      $$(".plan").forEach(function (card) { card.classList.remove("is-match"); });
      $(".choice", q1).focus();
    });
  }

  updateForm();
})();
