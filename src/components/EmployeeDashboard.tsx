import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface EmployeeData {
  employeeName: string;
  admin: string;
}

const EmployeeLandingPage = () => {
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeData | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const inactivityPeriodsRef = useRef<{ start: Date; end: Date | null }[]>([]);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityDuration = 0.5 * 60 * 1000;

  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/employee/${employeeId}`
          );
          setEmployeeDetails(res.data.employee);
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const getUserScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = screenStream;
    } catch (err) {
      console.error("Error capturing screen:", err);
    }
  };

  const stopScreenCapturing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
  };

  const notifyAdmin = useCallback(async () => {
    if (!screenStreamRef.current) {
      console.warn("Cannot notify admin: Screen is not being captured");
      return;
    }

    try {
      const adminId = employeeDetails?.admin;
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/notify-admin`,
        {
          message: `${employeeDetails?.employeeName} has been inactive for the last 5 minutes`,
          adminId,
        }
      );
      console.log(response);

      toast.success("Admin notified");
    } catch (error) {
      console.error("Error sending inactivity notification:", error);
    }
  }, [employeeDetails]);

  const resetInactiveTimer = useCallback(() => {
    if (!screenStreamRef.current) {
      console.warn("Cannot reset inactivity timer: Screen is not being captured");
      return;
    }

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      logInactivityPeriod();
      notifyAdmin();
    }, inactivityDuration);
  }, [notifyAdmin]);

  const logInactivityPeriod = useCallback(() => {
    if (!screenStreamRef.current) {
      return;
    }

    inactivityPeriodsRef.current = [
      ...inactivityPeriodsRef.current,
      { start: new Date(), end: null },
    ];
  }, []);

  const handleActivity = useCallback(() => {
    if (!screenStreamRef.current) {
      return;
    }

    resetInactiveTimer();
    const inactivityPeriods = inactivityPeriodsRef.current;
    if (inactivityPeriods.length > 0) {
      const lastPeriod = inactivityPeriods[inactivityPeriods.length - 1];
      if (!lastPeriod.end) {
        lastPeriod.end = new Date();
      }
    }
  }, [resetInactiveTimer]);

  const generateInactivityReport = () => {
    const report = inactivityPeriodsRef.current
      .map((period, index) => {
        const start = period.start.toLocaleTimeString();
        const end = period.end
          ? period.end.toLocaleTimeString()
          : "still inactive";
        return `${index + 1}) ${start} to ${end}`;
      })
      .join("\n");
    return report;
  };

  const handleCheckout = async () => {
    if (!screenStreamRef.current) {
      console.warn("Cannot checkout: Screen is not being captured");
      return;
    }

    if (employeeDetails) {
      const report = generateInactivityReport();
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/send-report`,
          {
            employeeId: employeeId,
            report,
          }
        );
        console.log(response);

        toast.success("Inactivity report sent to admin");
      } catch (error) {
        console.error("Error sending inactivity report:", error);
      }
      inactivityPeriodsRef.current = [];
    }
    stopScreenCapturing();
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);

    if (screenStreamRef.current) {
      resetInactiveTimer();
    }

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [handleActivity, resetInactiveTimer]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {employeeDetails?.employeeName}
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={getUserScreen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check In
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleCheckout}
        >
          Check Out
        </button>
      </div>
      {screenStreamRef.current && (
        <video
          autoPlay
          playsInline
          muted
          ref={(video) => {
            if (video) {
              video.srcObject = screenStreamRef.current;
            }
          }}
          className="mt-4"
          style={{ width: "80%", height: "auto" }}
        />
      )}
    </div>
  );
};

export default EmployeeLandingPage;
