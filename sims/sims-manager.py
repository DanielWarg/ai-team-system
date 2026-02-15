#!/usr/bin/env python3
"""
SIMS Manager - Relationships, Mood, Events for AI Team

Updates relationships.json, mood.json, events/*.json based on agent interactions.
Called by Team Debrief after analyzing daily reports.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone

# SIMS files location (in main agents/team/ for cross-system access)
BASE_DIR = Path("/Users/evil/projekt-kompass/agents/team")

def load_json(filename):
    """Load JSON file"""
    path = BASE_DIR / filename
    if not path.exists():
        return {}
    with open(path) as f:
        return json.load(f)

def save_json(filename, data):
    """Save JSON file"""
    path = BASE_DIR / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def update_relationship(agent1, agent2, delta, event_description):
    """Update relationship between two agents"""
    relationships = load_json("relationships.json")
    
    # Sort agent names for consistent key
    key = f"{agent1}_{agent2}" if agent1 < agent2 else f"{agent2}_{agent1}"
    
    if key not in relationships:
        relationships[key] = {
            "score": 0.5,
            "status": "neutral",
            "history": [],
            "traits": {}
        }
    
    rel = relationships[key]
    old_score = rel["score"]
    new_score = max(0.0, min(1.0, old_score + delta))
    
    # Update score
    rel["score"] = new_score
    
    # Update status based on score
    if new_score >= 0.9:
        rel["status"] = "allies"
    elif new_score >= 0.8:
        rel["status"] = "allies"
    elif new_score >= 0.5:
        rel["status"] = "neutral/respectful"
    elif new_score >= 0.3:
        rel["status"] = "frustrated"
    else:
        rel["status"] = "hostile"
    
    # Add to history
    rel["history"].append({
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "event": event_description,
        "delta": delta,
        "note": f"Score changed from {old_score:.2f} to {new_score:.2f}"
    })
    
    # Update meta
    relationships["meta"]["last_updated"] = datetime.now(timezone.utc).isoformat()
    
    save_json("relationships.json", relationships)
    print(f"✅ Relationship {key}: {old_score:.2f} → {new_score:.2f} ({rel['status']})")

def update_mood(agent, mood, intensity, reason):
    """Update agent's mood"""
    moods = load_json("mood.json")
    
    if agent not in moods:
        moods[agent] = {
            "current": "focused",
            "intensity": 0.5,
            "reason": "Normal working state",
            "since": datetime.now(timezone.utc).isoformat(),
            "affects": {},
            "history": []
        }
    
    # Archive old mood
    old_mood = moods[agent]
    moods[agent]["history"].append({
        "mood": old_mood["current"],
        "intensity": old_mood["intensity"],
        "reason": old_mood["reason"],
        "start": old_mood["since"],
        "end": datetime.now(timezone.utc).isoformat()
    })
    
    # Set new mood
    moods[agent]["current"] = mood
    moods[agent]["intensity"] = intensity
    moods[agent]["reason"] = reason
    moods[agent]["since"] = datetime.now(timezone.utc).isoformat()
    
    # Mood effects (simplified)
    effects = {
        "frustrated": {"creativity": -0.2, "defensiveness": +0.4, "thoroughness": +0.3},
        "confident": {"assertiveness": +0.3, "risk_tolerance": -0.1, "thoroughness": +0.2},
        "satisfied": {"vigilance": +0.2, "harshness": -0.1, "confidence": +0.2},
        "excited": {"creativity": +0.4, "risk_tolerance": +0.2, "thoroughness": -0.1},
        "defensive": {"collaboration": -0.3, "thoroughness": +0.2, "openness": -0.2}
    }
    moods[agent]["affects"] = effects.get(mood, {})
    
    # Update meta
    moods["meta"]["last_updated"] = datetime.now(timezone.utc).isoformat()
    
    save_json("mood.json", moods)
    print(f"✅ Mood {agent}: {mood} ({intensity:.1f})")

def log_event(event_type, participants, trigger, outcome, relationship_changes=None, mood_changes=None, learnings=None):
    """Log an event"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    events_file = f"events/{today}.json"
    
    events = load_json(events_file)
    if "events" not in events:
        events = {"date": today, "events": [], "summary": "", "overall_mood": "", "key_learnings": []}
    
    event = {
        "time": datetime.now(timezone.utc).isoformat(),
        "type": event_type,
        "participants": participants,
        "trigger": trigger,
        "outcome": outcome
    }
    
    if relationship_changes:
        event["relationship_changes"] = relationship_changes
    if mood_changes:
        event["mood_changes"] = mood_changes
    if learnings:
        event["learnings"] = learnings
    
    events["events"].append(event)
    
    save_json(events_file, events)
    print(f"✅ Event logged: {event_type}")

def get_relationship_context(agent1, agent2):
    """Get relationship context for agent prompts"""
    relationships = load_json("relationships.json")
    key = f"{agent1}_{agent2}" if agent1 < agent2 else f"{agent2}_{agent1}"
    
    if key not in relationships:
        return f"Neutral relationship (no history yet)"
    
    rel = relationships[key]
    score = rel["score"]
    status = rel["status"]
    
    if score < 0.4:
        return f"Frustrated relationship ({score:.1f}) - be defensive, short responses"
    elif score < 0.7:
        return f"Respectful relationship ({score:.1f}) - professional, balanced"
    else:
        return f"Strong relationship ({score:.1f}) - collaborative, supportive"

def get_mood_context(agent):
    """Get mood context for agent prompts"""
    moods = load_json("mood.json")
    
    if agent not in moods:
        return "Focused mood (normal working state)"
    
    mood_data = moods[agent]
    mood = mood_data["current"]
    intensity = mood_data["intensity"]
    reason = mood_data["reason"]
    affects = mood_data.get("affects", {})
    
    context = f"Current mood: {mood} ({intensity:.1f}/1.0)\n"
    context += f"Reason: {reason}\n"
    
    if affects:
        context += "Effects:\n"
        for trait, delta in affects.items():
            sign = "+" if delta > 0 else ""
            context += f"  - {trait}: {sign}{delta:.1f}\n"
    
    return context

def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  sims-manager.py update-relationship <agent1> <agent2> <delta> <event>")
        print("  sims-manager.py update-mood <agent> <mood> <intensity> <reason>")
        print("  sims-manager.py log-event <type> <participants> <trigger> <outcome>")
        print("  sims-manager.py get-context <agent>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "update-relationship":
        agent1, agent2, delta, event = sys.argv[2], sys.argv[3], float(sys.argv[4]), " ".join(sys.argv[5:])
        update_relationship(agent1, agent2, delta, event)
    
    elif command == "update-mood":
        agent, mood, intensity, reason = sys.argv[2], sys.argv[3], float(sys.argv[4]), " ".join(sys.argv[5:])
        update_mood(agent, mood, intensity, reason)
    
    elif command == "log-event":
        event_type, participants_str, trigger, outcome = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
        participants = participants_str.split(",")
        log_event(event_type, participants, trigger, outcome)
    
    elif command == "get-context":
        agent = sys.argv[2]
        print("\n" + "="*50)
        print(f"SIMS CONTEXT FOR {agent.upper()}")
        print("="*50 + "\n")
        print(get_mood_context(agent))
        print()
        
        # Show relationships with other agents
        for other in ["scout", "analyst", "skeptiker"]:
            if other != agent:
                print(get_relationship_context(agent, other))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
