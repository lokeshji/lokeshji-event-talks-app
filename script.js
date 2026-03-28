// Placeholder talks data will be injected here by the Node.js script
const talksData = []; // This will be populated by generate_website.js

document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const categorySearchInput = document.getElementById('categorySearch');

    let currentSchedule = []; // To store the schedule with calculated times and types

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    function calculateSchedule(data) {
        const schedule = [];
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0); // Event starts at 10:00 AM

        const talkDuration = 60; // minutes
        const transitionDuration = 10; // minutes
        const lunchDuration = 60; // minutes

        for (let i = 0; i < data.length; i++) {
            const talk = data[i];
            const talkStart = new Date(currentTime);
            const talkEnd = new Date(talkStart.getTime() + talk.duration * 60 * 1000);

            schedule.push({
                type: 'talk',
                id: talk.id,
                title: talk.title,
                speakers: talk.speakers,
                category: talk.category,
                description: talk.description,
                startTime: formatTime(talkStart),
                endTime: formatTime(talkEnd),
                rawStartTime: talkStart.getTime() // For sorting/filtering
            });
            currentTime = new Date(talkEnd.getTime());

            // Add transition after each talk, except the last one
            if (i < data.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + transitionDuration);
            }

            // Add lunch break after the 3rd talk
            if (i === 2) {
                const lunchStart = new Date(currentTime);
                const lunchEnd = new Date(lunchStart.getTime() + lunchDuration * 60 * 1000);
                schedule.push({
                    type: 'break',
                    title: 'Lunch Break',
                    startTime: formatTime(lunchStart),
                    endTime: formatTime(lunchEnd),
                    rawStartTime: lunchStart.getTime()
                });
                currentTime = new Date(lunchEnd.getTime());
            }
        }
        return schedule;
    }

    function renderSchedule(filteredSchedule) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        if (filteredSchedule.length === 0) {
            scheduleContainer.innerHTML = `
                <div class="schedule-item no-results">
                    No talks found matching your search.
                </div>
            `;
            return;
        }

        filteredSchedule.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('schedule-item', item.type);

            let content = `<div class="time">${item.startTime} - ${item.endTime}</div>`;
            content += `<div class="details">`;

            if (item.type === 'talk') {
                content += `<h3 class="talk-title">${item.title}</h3>`;
                if (item.speakers && item.speakers.length > 0) {
                    content += `<p class="speakers">Speakers: ${item.speakers.map(s => s.name).join(', ')}</p>`;
                }
                if (item.category && item.category.length > 0) {
                    content += `<p class="categories">Categories: ${item.category.join(', ')}</p>`;
                }
                content += `<p class="description">${item.description}</p>`;
            } else if (item.type === 'break') {
                content += `<h3 class="break-info">${item.title}</h3>`;
            }

            content += `</div>`;
            itemElement.innerHTML = content;
            scheduleContainer.appendChild(itemElement);
        });
    }

    // Initial schedule calculation and render
    currentSchedule = calculateSchedule(talksData);
    renderSchedule(currentSchedule);

    // Search functionality
    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        const filteredTalks = talksData.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );

        // Re-calculate schedule for filtered talks
        // If no search term, show full schedule
        const scheduleToRender = searchTerm ? calculateSchedule(filteredTalks) : currentSchedule;
        renderSchedule(scheduleToRender);
    });
});
