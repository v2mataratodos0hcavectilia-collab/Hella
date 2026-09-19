import { useState, useEffect } from 'react';
import { SimulationState, LocationType } from '../types';

interface DynamicEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  location: LocationType;
  effect: 'bladder' | 'vitals' | 'social' | 'economy' | 'none';
  effectValue: number;
  duration: number; // in seconds
  startTime: number;
  active: boolean;
}

interface DynamicEventsProps {
  state: SimulationState;
}

const EVENT_TEMPLATES = {
  home: [
    {
      title: 'Doorbell Rings',
      description: 'Someone is at the door! This adds a bit of stress.',
      icon: '🔔',
      effect: 'vitals' as const,
      effectValue: 10,
      duration: 30,
    },
    {
      title: 'Phone Call',
      description: 'An unexpected call from a friend. Social interaction!',
      icon: '📞',
      effect: 'social' as const,
      effectValue: 5,
      duration: 60,
    },
    {
      title: 'Found Money',
      description: 'You found $5 in your pocket!',
      icon: '💵',
      effect: 'economy' as const,
      effectValue: 5,
      duration: 0,
    },
  ],
  office: [
    {
      title: 'Meeting Scheduled',
      description: 'An unexpected meeting was just scheduled. Stress increases.',
      icon: '📅',
      effect: 'vitals' as const,
      effectValue: 15,
      duration: 120,
    },
    {
      title: 'Coffee Break',
      description: 'Your boss offers you a coffee break. Nice!',
      icon: '☕',
      effect: 'bladder' as const,
      effectValue: 50,
      duration: 0,
    },
    {
      title: 'Overtime Offer',
      description: 'Extra work means extra pay! +$20',
      icon: '💼',
      effect: 'economy' as const,
      effectValue: 20,
      duration: 0,
    },
  ],
  car: [
    {
      title: 'Traffic Jam',
      description: 'Stuck in traffic! This is stressful and you can\'t move.',
      icon: '🚗',
      effect: 'vitals' as const,
      effectValue: 20,
      duration: 180,
    },
    {
      title: 'Smooth Ride',
      description: 'The traffic cleared up! Stress decreases.',
      icon: '🛣️',
      effect: 'vitals' as const,
      effectValue: -10,
      duration: 60,
    },
    {
      title: 'Gas Station Stop',
      description: 'Quick stop for snacks. -$3',
      icon: '⛽',
      effect: 'economy' as const,
      effectValue: -3,
      duration: 0,
    },
  ],
  bathroom: [
    {
      title: 'Occupied',
      description: 'Someone is using the bathroom. You have to wait.',
      icon: '🚽',
      effect: 'vitals' as const,
      effectValue: 15,
      duration: 60,
    },
    {
      title: 'Clean Bathroom',
      description: 'The bathroom is clean and fresh. Stress decreases.',
      icon: '✨',
      effect: 'vitals' as const,
      effectValue: -15,
      duration: 120,
    },
  ],
  bedroom: [
    {
      title: 'Comfortable Bed',
      description: 'Your bed is so comfortable. Very relaxing.',
      icon: '🛏️',
      effect: 'vitals' as const,
      effectValue: -20,
      duration: 180,
    },
    {
      title: 'Late Night Snack',
      description: 'Couldn\'t resist a midnight snack. Bladder fills faster.',
      icon: '🍪',
      effect: 'bladder' as const,
      effectValue: 30,
      duration: 0,
    },
  ],
  kitchen: [
    {
      title: 'Cooking Session',
      description: 'You made a big meal! Bladder fills up.',
      icon: '🍳',
      effect: 'bladder' as const,
      effectValue: 100,
      duration: 0,
    },
    {
      title: 'Water Break',
      description: 'Drank a big glass of water. +250ml',
      icon: '💧',
      effect: 'bladder' as const,
      effectValue: 250,
      duration: 0,
    },
  ],
  meeting_room: [
    {
      title: 'Long Presentation',
      description: 'The presentation is dragging on. Very stressful.',
      icon: '📊',
      effect: 'vitals' as const,
      effectValue: 25,
      duration: 240,
    },
    {
      title: 'Networking Opportunity',
      description: 'Made a valuable connection! Followers +10',
      icon: '🤝',
      effect: 'social' as const,
      effectValue: 10,
      duration: 0,
    },
  ],
  elevator: [
    {
      title: 'Stuck in Elevator',
      description: 'The elevator stopped between floors! Very stressful.',
      icon: '🛗',
      effect: 'vitals' as const,
      effectValue: 30,
      duration: 300,
    },
    {
      title: 'Crowded Elevator',
      description: 'So many people in here. Uncomfortable.',
      icon: '👥',
      effect: 'vitals' as const,
      effectValue: 15,
      duration: 60,
    },
  ],
  gym: [
    {
      title: 'Intense Workout',
      description: 'Pushing through a tough workout! Bladder filling faster.',
      icon: '🏋️',
      effect: 'bladder' as const,
      effectValue: 150,
      duration: 0,
    },
    {
      title: 'Personal Trainer',
      description: 'Got a personal trainer session! Stress decreases.',
      icon: '💪',
      effect: 'vitals' as const,
      effectValue: -15,
      duration: 120,
    },
    {
      title: 'Gym Selfie',
      description: 'Took a gym selfie and posted it! Followers +15',
      icon: '📸',
      effect: 'social' as const,
      effectValue: 15,
      duration: 0,
    },
  ],
  restaurant: [
    {
      title: 'Big Meal',
      description: 'Enjoyed a huge meal! Bladder filling up fast.',
      icon: '🍽️',
      effect: 'bladder' as const,
      effectValue: 200,
      duration: 0,
    },
    {
      title: 'Date Night',
      description: 'Having a romantic dinner! Very relaxing.',
      icon: '🕯️',
      effect: 'vitals' as const,
      effectValue: -20,
      duration: 180,
    },
    {
      title: 'Expensive Bill',
      description: 'The bill was higher than expected. -$50',
      icon: '💸',
      effect: 'economy' as const,
      effectValue: -50,
      duration: 0,
    },
  ],
  mall: [
    {
      title: 'Shopping Spree',
      description: 'Bought some new clothes! Feeling good.',
      icon: '🛍️',
      effect: 'vitals' as const,
      effectValue: -10,
      duration: 90,
    },
    {
      title: 'Long Walk',
      description: 'Walked around the mall for hours. Bladder filling.',
      icon: '🚶',
      effect: 'bladder' as const,
      effectValue: 100,
      duration: 0,
    },
    {
      title: 'Food Court',
      description: 'Grabbed snacks at the food court. +$5',
      icon: '🍔',
      effect: 'economy' as const,
      effectValue: -5,
      duration: 0,
    },
  ],
  beach: [
    {
      title: 'Hot Sun',
      description: 'The sun is blazing! Sweating and dehydrated.',
      icon: '☀️',
      effect: 'bladder' as const,
      effectValue: -50,
      duration: 120,
    },
    {
      title: 'Ocean Swim',
      description: 'Went for a swim! Very refreshing and relaxing.',
      icon: '🏊',
      effect: 'vitals' as const,
      effectValue: -25,
      duration: 150,
    },
    {
      title: 'Beach Selfie',
      description: 'Posted a beach photo! Followers +20',
      icon: '📷',
      effect: 'social' as const,
      effectValue: 20,
      duration: 0,
    },
  ],
  airport: [
    {
      title: 'Flight Delay',
      description: 'Your flight is delayed! Very stressful.',
      icon: '✈️',
      effect: 'vitals' as const,
      effectValue: 35,
      duration: 600,
    },
    {
      title: 'Duty Free Shopping',
      description: 'Bought some souvenirs. -$30',
      icon: '🛒',
      effect: 'economy' as const,
      effectValue: -30,
      duration: 0,
    },
    {
      title: 'Airport Lounge',
      description: 'Found a quiet lounge to relax in.',
      icon: '🛋️',
      effect: 'vitals' as const,
      effectValue: -20,
      duration: 180,
    },
  ],
  concert: [
    {
      title: 'Amazing Performance',
      description: 'The concert is incredible! Very exciting.',
      icon: '🎵',
      effect: 'vitals' as const,
      effectValue: -15,
      duration: 240,
    },
    {
      title: 'Crowded Venue',
      description: 'So many people! Hard to move around.',
      icon: '👨‍👩‍👧‍👦',
      effect: 'vitals' as const,
      effectValue: 20,
      duration: 180,
    },
    {
      title: 'Live Stream Moment',
      description: 'Posted a live clip from the concert! Followers +25',
      icon: '📱',
      effect: 'social' as const,
      effectValue: 25,
      duration: 0,
    },
  ],
};

export default function DynamicEvents({ state }: DynamicEventsProps) {
  const [events, setEvents] = useState<DynamicEvent[]>([]);
  const [lastEventTime, setLastEventTime] = useState(0);

  // Generate random events
  const generateEvent = () => {
    const locationEvents = EVENT_TEMPLATES[state.location] || EVENT_TEMPLATES.home;
    const template = locationEvents[Math.floor(Math.random() * locationEvents.length)];

    const newEvent: DynamicEvent = {
      id: `event_${state.simTime}_${Math.random()}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      location: state.location,
      effect: template.effect,
      effectValue: template.effectValue,
      duration: template.duration,
      startTime: state.simTime,
      active: true,
    };

    setEvents(prev => [...prev.slice(-4), newEvent]); // Keep only last 5 events
    setLastEventTime(state.simTime);
  };

  // Check for expired events
  useEffect(() => {
    setEvents(prev =>
      prev.map(event => ({
        ...event,
        active: event.duration === 0 || (state.simTime - event.startTime) < event.duration,
      }))
    );
  }, [state.simTime]);

  // Generate events periodically
  useEffect(() => {
    const timeSinceLastEvent = state.simTime - lastEventTime;
    const eventChance = state.timeSpeed > 60 ? 0.001 : 0.005; // Less frequent at high speeds

    if (timeSinceLastEvent > 300 && Math.random() < eventChance) { // At least 5 minutes between events
      generateEvent();
    }
  }, [state.simTime, state.location, state.timeSpeed]);

  const activeEvents = events.filter(e => e.active);

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <h3 className="text-lg font-bold text-white mb-3">⚡ Dynamic Events</h3>

      {activeEvents.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No active events
        </div>
      ) : (
        <div className="space-y-2">
          {activeEvents.map(event => (
            <div
              key={event.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{event.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{event.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                  
                  {/* Effect indicator */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Effect:</span>
                    <span className={`text-xs font-bold ${
                      event.effectValue > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {event.effect === 'bladder' && `💧 ${event.effectValue > 0 ? '+' : ''}${event.effectValue}ml`}
                      {event.effect === 'vitals' && `❤️ ${event.effectValue > 0 ? '+' : ''}${event.effectValue} stress`}
                      {event.effect === 'social' && `👥 +${event.effectValue} followers`}
                      {event.effect === 'economy' && `💰 ${event.effectValue > 0 ? '+' : ''}$${Math.abs(event.effectValue)}`}
                    </span>
                  </div>

                  {/* Duration */}
                  {event.duration > 0 && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Duration</span>
                        <span>{Math.max(0, Math.floor((event.duration - (state.simTime - event.startTime)) / 60))}m left</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all"
                          style={{
                            width: `${Math.max(0, ((event.duration - (state.simTime - event.startTime)) / event.duration) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
