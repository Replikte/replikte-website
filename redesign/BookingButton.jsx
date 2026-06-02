const BOOKING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2C8T1V9tbQgsS-_SvRnevJIwAGW8nQY9QD0HrSkN1Dgo-JVHcKWUmrercQGXvLW7AlqnXiRY6A?gv=true';
const DEFAULT_COLOR = '#3F51B5';

const BookingButton = ({ label = 'Book a Call', className = 'gcal-booking', style, color }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function load() {
      if (!window.calendar || !calendar.schedulingButton) return false;
      calendar.schedulingButton.load({
        url: BOOKING_URL,
        color: color || DEFAULT_COLOR,
        label,
        target: el,
      });
      return true;
    }

    if (load()) return;

    const onLoad = () => {
      if (!load()) {
        const a = document.createElement('a');
        a.href = BOOKING_URL;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = label;
        el.appendChild(a);
      }
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [label, color]);

  return <span ref={ref} className={className} style={style} />;
};

Object.assign(window, { BookingButton, BOOKING_URL });
