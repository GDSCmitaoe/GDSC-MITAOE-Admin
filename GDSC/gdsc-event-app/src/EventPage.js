import React, { useState } from "react";
import "./EventPage.css";

const EventPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingEvents = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "2023-10-15",
      description: "Learn the fundamentals of web development.",
    },
    {
      id: 2,
      title: "Machine Learning Seminar",
      date: "2023-11-10",
      description: "Explore the world of machine learning.",
    },
    {
      id: 3,
      title: "Mobile App Development Workshop",
      date: "2023-12-05",
      description: "Create your own mobile apps.",
    },
  ];

  const liveEvents = [
    {
      id: 4,
      title: "Google-Cloud-Study-Jam",
      date: "2023-10-01",
      description: "Learn the fundamentals of Google Cloud technologies.",
    },
    {
      id: 5,
      title: "AI Workshop",
      date: "2023-10-15",
      description: "Dive into the world of artificial intelligence.",
    },
    {
      id: 6,
      title: "Tech Conference",
      date: "2023-11-01",
      description: "Join our tech conference and network with experts.",
    },
  ];

  const pastEvents = [
    {
      id: 7,
      title: "Hackathon Recap",
      date: "2023-09-20",
      description: "Review the highlights of our recent hackathon.",
    },
    {
      id: 8,
      title: "Tech Conference",
      date: "2023-08-15",
      description: "Recap of our tech conference and networking event.",
    },
    {
      id: 9,
      title: "AI Workshop",
      date: "2023-07-25",
      description: "Delve into the world of artificial intelligence.",
    },
  ];

  return (
    <div className="event-page">
      <h1 className="page-heading">Events & Workshops</h1>
      <p className="page-subheading">Learn, Share, and Connect with Us in Person</p>

      <div className="buttons">
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`tab ${activeTab === "live" ? "active" : ""}`}
          onClick={() => setActiveTab("live")}
        >
          Live Events
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      <div className="events-container">
        {activeTab === "upcoming" &&
          upcomingEvents.map((event) => (
            <div className="event" key={event.id}>
              <h2>{event.title}</h2>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
        {activeTab === "live" &&
          liveEvents.map((event) => (
            <div className="event" key={event.id}>
              <h2>{event.title}</h2>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
        {activeTab === "past" &&
          pastEvents.map((event) => (
            <div className="event" key={event.id}>
              <h2>{event.title}</h2>
              <p>Date: {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EventPage;
