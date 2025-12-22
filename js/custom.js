        (function () {
            // Config: base date to start alternating weeks (15th December of current year)
            var base = moment([moment().year(), 11, 15]); // month index 11 = December
            var today = moment().startOf('day');
            var calendarRoot = document.getElementById('bookingCalendar');
            var displayInput = document.getElementById('departDate');
            var hiddenInput = document.getElementById('departDateValue');

            // number of weeks to show
            var monthsToShow = 3;

            function weekIsAvailable(d) {
                 // compute difference in ISO week number from base; alternate availability
                // var diff = d.isoWeek() - base.isoWeek() + (d.isoWeekYear() - base.isoWeekYear()) * 52;
                // return (diff % 2) === 0; // even => available (green)

                // Only Sundays are available. ISO weekday 7 === Sunday.
                if (!d || typeof d.isoWeekday !== 'function') return false;
                return d.isoWeekday() === 7;
            }

            function renderCalendar() {
                if (!calendarRoot) return;
                calendarRoot.innerHTML = '';
                var startMonth = today.clone().startOf('month');

                var wrapper = document.createElement('div');
                wrapper.className = 'booking-months-wrapper';

                for (var m = 0; m < monthsToShow; m++) {
                    var month = startMonth.clone().add(m, 'months');
                    var monthDiv = document.createElement('div');
                    monthDiv.className = 'booking-month';

                    var header = document.createElement('div');
                    header.className = 'booking-month-header';
                    header.textContent = month.format('MMMM YYYY');
                    monthDiv.appendChild(header);

                    var weekdays = document.createElement('div');
                    weekdays.className = 'booking-weekdays';
                    var wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    wd.forEach(function (w) { var el = document.createElement('div'); el.className = 'booking-weekday'; el.textContent = w; weekdays.appendChild(el); });
                    monthDiv.appendChild(weekdays);

                    var daysGrid = document.createElement('div');
                    daysGrid.className = 'booking-days-grid';

                    var firstDayWeekday = month.clone().startOf('month').isoWeekday(); // 1..7
                    var leading = firstDayWeekday - 1; // blanks before first day
                    for (var i = 0; i < leading; i++) {
                        var blank = document.createElement('div'); blank.className = 'booking-day blank'; daysGrid.appendChild(blank);
                    }

                    var daysInMonth = month.daysInMonth();
                    for (var d = 1; d <= daysInMonth; d++) {
                        (function (day) {
                            var dt = month.clone().date(day);
                            var cell = document.createElement('div');
                            cell.className = 'booking-day';
                            cell.textContent = day;
                            if (dt.isBefore(today, 'day')) {
                                cell.classList.add('disabled');
                            } else {
                                var avail = weekIsAvailable(dt);
                                cell.classList.add(avail ? 'available' : 'unavailable');
                                if (avail) {
                                    cell.addEventListener('click', function () {
                                        displayInput.value = dt.format('YYYY-MM-DD');
                                        hiddenInput.value = dt.format();
                                        // clear previous
                                        wrapper.querySelectorAll('.booking-day.selected').forEach(function (el) { el.classList.remove('selected'); });
                                        cell.classList.add('selected');
                                    });
                                }
                            }
                            daysGrid.appendChild(cell);
                        })(d);
                    }

                    monthDiv.appendChild(daysGrid);
                    wrapper.appendChild(monthDiv);
                }

                calendarRoot.appendChild(wrapper);
            }

            // initial render
            renderCalendar();

            // small helper: re-render at midnight in case day changes
            var msUntilMidnight = moment().endOf('day').diff(moment()) + 2000;
            setTimeout(function () { renderCalendar(); }, msUntilMidnight);
        })();

        (function () {
            var btn = document.getElementById('bookingSubmitBtn');
            if (!btn) return;
            btn.addEventListener('click', function () {
                var destEl = document.getElementById('bookingDestination');
                var dest = destEl ? destEl.value : '';
                var date = (document.getElementById('departDateValue') && document.getElementById('departDateValue').value) || (document.getElementById('departDate') && document.getElementById('departDate').value);
                if (!dest || dest === 'Select Destination') { alert('Please select a destination.'); return; }
                if (!date) { alert('Please select a departure date.'); return; }
                var waNumber = '919690169183';
                var message = 'Hi I want to go to ' + dest + ' on ' + date;
                var url = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message);
                window.open(url, '_blank');
            });
        })();

        $(function () {
            var $gallery = $(".gallery-carousel");
            // Preload all images, compute scaled widths using card height, append items
            // with that width so placeholders match the final size. Initialize Owl
            // only after processing all images to avoid layout shifts.
            var total = 82;
            var processed = 0;
            var fixedHeight = parseInt($('.gallery-img-card').css('height')) || 420;
            for (var i = 1; i <= total; i++) {
                (function (index) {
                    var url = 'img/i' + index + '.jpeg';
                    var img = new Image();
                    img.onload = function () {
                        // compute scaled width to preserve true width given fixed height
                        var scaledWidth = Math.round((img.naturalWidth / img.naturalHeight) * fixedHeight);
                        var $item = $(
                            "<div class='card border-0 shadow-sm gallery-img-card gallery-img-spacing' style='width:" + scaledWidth + "px;'>" +
                            "<div class='gallery-bg' aria-hidden='true'></div>" +
                            "</div>"
                        );
                        // tag orientation (kept for styling if needed)
                        if (img.naturalWidth < img.naturalHeight) $item.addClass('portrait'); else $item.addClass('landscape');
                        $item.find('.gallery-bg').css({
                            'background-image': 'url(' + url + ')',
                            'background-size': 'auto 100%',
                            'background-position': 'center center',
                            'background-repeat': 'no-repeat'
                        });
                        $gallery.append($item);
                        processed++;
                        if (processed === total) {
                            initGallery();
                        }
                    };
                    img.onerror = function () {
                        processed++;
                        if (processed === total) {
                            initGallery();
                        }
                    };
                    img.src = url;
                })(i);
            }

            function initGallery() {
                $gallery.owlCarousel({
                    loop: true,
                    margin: 20,
                    nav: false,
                    dots: false,
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: { items: 1 },
                        600: { items: 2 },
                        900: { items: 3 },
                        1200: { items: 4 }
                    },
                    autoWidth: true
                });
                // Arrow controls
                $('.gallery-arrow-left').click(function () {
                    $gallery.trigger('prev.owl.carousel');
                });
                $('.gallery-arrow-right').click(function () {
                    $gallery.trigger('next.owl.carousel');
                });
            }
        });

        // Reusable WhatsApp form handler
        function handleWhatsAppForm(formId, getMessage) {
            var form = document.getElementById(formId);
            if (!form) return;
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var waNumber = '919690169183'; // WhatsApp number in international format, no +
                var message = getMessage();
                if (!message) return;
                var waUrl = `https://wa.me/${waNumber}?text=` + encodeURIComponent(message);
                window.open(waUrl, '_blank');
            });
        }

        // Registration form WhatsApp handler
        handleWhatsAppForm('whatsappForm', function () {
            var name = document.getElementById('waName').value.trim();
            var phone = document.getElementById('waPhone').value.trim();
            var destination = document.getElementById('waDestination').value;
            if (!name || !phone || !destination) {
                alert('Please fill all required fields and select a destination.');
                return '';
            }
            return `Hi I am ${name}, with number ${phone} and I want to visit ${destination}, Kindly add me to your whatsapp group. Source - Through Website`;
        });

        // Contact form WhatsApp handler
        handleWhatsAppForm('contactForm', function () {
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var subject = document.getElementById('subject').value.trim();
            var messageText = document.getElementById('message').value.trim();
            if (!name || !email || !subject || !messageText) {
                alert('Please fill all required fields.');
                return '';
            }
            return `Hi, I am ${name} (${email}). Subject: ${subject}. Message: ${messageText} Source - Through Website`;
        });

        (function () {
            try {
                var links = document.querySelectorAll('link[rel*="icon"]');
                var t = Date.now();
                links.forEach(function (l) {
                    // only update if href exists
                    if (l && l.href) l.href = l.href.split('?')[0] + '?v=' + t;
                });
            } catch (e) {
                // silent
            }
        })();
