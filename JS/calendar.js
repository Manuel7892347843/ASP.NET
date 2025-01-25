const daysOfWeek = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    let currentDate = new Date();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem("events")) || {};

    function renderCalendar() {
        const monthYearLabel = document.getElementById('month-year');
        const calendarGrid = document.getElementById('calendar-grid');

        // Aggiorna il mese e anno
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYearLabel.textContent = `${getMonthName(month)} ${year}`;

        // Crea la griglia del calendario
        calendarGrid.innerHTML = '';

        // Aggiungi i giorni della settimana
        daysOfWeek.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.textContent = day;
            calendarGrid.appendChild(dayLabel);
        });

        // Calcola il primo giorno del mese
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayIndex = firstDayOfMonth.getDay();

        // Calcola il numero di giorni nel mese
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // Aggiungi i giorni del mese
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.onclick = () => selectDate(day);
            const dayDate = new Date(year, month, day);

            // Mostra gli eventi per la data selezionata
            if (events[dayDate.toDateString()]) {
                dayCell.style.backgroundColor = "#ffeb3b";
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    function getMonthName(monthIndex) {
        const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        return months[monthIndex];
    }

    function selectDate(day) {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        showEventInput();
    }

    function showEventInput() {
        const dateString = selectedDate.toDateString();
        const eventInput = document.getElementById("event-input");
        const eventTitle = document.getElementById("event-title");
        const eventTime = document.getElementById("event-time");
        const eventDescription = document.getElementById("event-description");

        if (events[dateString]) {
            const event = events[dateString];
            eventTitle.value = event.title;
            eventTime.value = event.time;
            eventDescription.value = event.description;
        } else {
            eventTitle.value = "";
            eventTime.value = "";
            eventDescription.value = "";
        }

        eventInput.style.display = "block";
    }

    function saveEvent() {
        const eventTitle = document.getElementById("event-title").value;
        const eventTime = document.getElementById("event-time").value;
        const eventDescription = document.getElementById("event-description").value;

        if (!eventTitle || !eventTime) {
            alert("Inserisci titolo e orario dell'evento!");
            return;
        }

        const dateString = selectedDate.toDateString();
        events[dateString] = {
            title: eventTitle,
            time: eventTime,
            description: eventDescription,
            notified: false // Aggiungi la proprietà notified per evitare notifiche ripetute
        };

        // Salva gli eventi nel localStorage
        localStorage.setItem("events", JSON.stringify(events));
        renderCalendar();
        document.getElementById("event-input").style.display = "none";
    }

    function removeEvent() {
        const dateString = selectedDate.toDateString();
        if (events[dateString]) {
            delete events[dateString]; // Rimuove l'evento dal nostro oggetto
            localStorage.setItem("events", JSON.stringify(events)); // Salva l'aggiornamento
            renderCalendar();
            document.getElementById("event-input").style.display = "none"; // Nascondi l'input
        } else {
            alert("Nessun evento da rimuovere per questa data.");
        }
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar();
    }

    function checkEventNotifications() {
        const currentTime = new Date();
        const currentDateString = currentTime.toDateString();  // Ottieni la data corrente nel formato "Day Mon DD YYYY"
        const currentTimeString = currentTime.toTimeString().substr(0, 5);  // Ottieni solo l'orario (HH:MM)

        // Cicla su tutti gli eventi
        Object.keys(events).forEach(dateString => {
            const eventDate = new Date(dateString);  // Ottieni la data dell'evento
            const eventTime = events[dateString].time;  // Orario dell'evento (HH:MM)

            // Controlla se la data dell'evento è la stessa del giorno corrente e l'orario è uguale
            if (eventDate.toDateString() === currentDateString && eventTime === currentTimeString) {
                // Verifica se l'evento è già stato notificato
                if (!events[dateString].notified) {
                    // Mostra l'alert e marca l'evento come notificato
                    alert(`È il momento dell'evento: ${events[dateString].title}`);
                    events[dateString].notified = true; // Aggiungi la proprietà "notified" per evitare notifiche future

                    // Salva gli eventi aggiornati nel localStorage
                    localStorage.setItem("events", JSON.stringify(events));
                }
            }
        });
    }

    // Renderizza il calendario iniziale
    renderCalendar();
    
    // Controlla ogni secondo se ci sono eventi
    setInterval(checkEventNotifications, 1000);