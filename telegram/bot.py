#!/usr/bin/env python3
"""
Telegram integration for AI Team System

Agents post findings to their channels + team discussion.
Daniel can follow along and participate.

Setup:
1. Create bot via @BotFather
2. Create groups: #scout, #analyst, #skeptiker, #team-discussion
3. Add bot to all groups
4. Get chat IDs: run `python3 bot.py get-chat-ids`
5. Update telegram/config.json with IDs
6. Agents use: `python3 bot.py post <agent> <message>`
"""

import json
import sys
import os
from pathlib import Path

try:
    import requests
except ImportError:
    print("❌ Missing dependency: pip install requests")
    sys.exit(1)

# Config path
CONFIG_PATH = Path(__file__).parent / "config.json"

def load_config():
    """Load Telegram config"""
    if not CONFIG_PATH.exists():
        return {
            "bot_token": "",
            "chats": {
                "scout": "",
                "analyst": "",
                "skeptiker": "",
                "team": "",
                "announcements": ""
            }
        }
    
    with open(CONFIG_PATH) as f:
        return json.load(f)

def save_config(config):
    """Save Telegram config"""
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)

def send_message(chat_id, text, parse_mode="Markdown"):
    """Send message to Telegram chat"""
    config = load_config()
    bot_token = config.get("bot_token")
    
    if not bot_token:
        print("❌ No bot token configured. Run setup first.")
        return False
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": True
    }
    
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        return True
    except Exception as e:
        print(f"❌ Failed to send message: {e}")
        return False

def get_updates():
    """Get recent updates (for finding chat IDs)"""
    config = load_config()
    bot_token = config.get("bot_token")
    
    if not bot_token:
        print("❌ No bot token configured.")
        print("\n📝 Steps to set up:")
        print("1. Message @BotFather on Telegram")
        print("2. Send /newbot")
        print("3. Follow prompts to create bot")
        print("4. Copy token")
        print("5. Run: python3 bot.py setup <token>")
        return
    
    url = f"https://api.telegram.org/bot{bot_token}/getUpdates"
    
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        if not data.get("result"):
            print("ℹ️  No updates yet. Send a message to the bot or add it to a group.")
            return
        
        print("\n📋 Recent chats:")
        seen = set()
        
        for update in data["result"]:
            msg = update.get("message", {})
            chat = msg.get("chat", {})
            chat_id = chat.get("id")
            chat_type = chat.get("type")
            title = chat.get("title", chat.get("first_name", "Unknown"))
            
            if chat_id and chat_id not in seen:
                seen.add(chat_id)
                print(f"  - {title} ({chat_type}): {chat_id}")
        
        print("\n💡 Copy these IDs to telegram/config.json")
        
    except Exception as e:
        print(f"❌ Failed to get updates: {e}")

def setup_bot(token):
    """Configure bot token"""
    config = load_config()
    config["bot_token"] = token
    save_config(config)
    print("✅ Bot token saved to telegram/config.json")
    print("\n📝 Next steps:")
    print("1. Create groups: #scout, #analyst, #skeptiker, #team-discussion, #announcements")
    print("2. Add bot to all groups")
    print("3. Send a message in each group")
    print("4. Run: python3 bot.py get-chat-ids")
    print("5. Update config.json with chat IDs")

def post_to_agent_channel(agent, message):
    """Post message to agent's channel + team discussion"""
    config = load_config()
    
    # Agent's private channel
    agent_chat = config["chats"].get(agent.lower())
    if agent_chat:
        send_message(agent_chat, message)
        print(f"✅ Posted to #{agent}")
    else:
        print(f"⚠️  No chat ID for {agent}")
    
    # Team discussion (all agents see it)
    team_chat = config["chats"].get("team")
    if team_chat:
        # Add agent header
        team_message = f"**{agent.upper()}:**\n\n{message}"
        send_message(team_chat, team_message)
        print(f"✅ Posted to #team-discussion")

def announce(message):
    """Post to announcements channel (Daniel sees it)"""
    config = load_config()
    announcements_chat = config["chats"].get("announcements")
    
    if announcements_chat:
        send_message(announcements_chat, message)
        print("✅ Announced to Daniel")
    else:
        print("⚠️  No announcements chat configured")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 bot.py setup <token>          # Configure bot token")
        print("  python3 bot.py get-chat-ids           # Find chat IDs")
        print("  python3 bot.py post <agent> <msg>     # Post to agent channel + team")
        print("  python3 bot.py announce <msg>         # Post to announcements")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "setup":
        if len(sys.argv) < 3:
            print("❌ Usage: python3 bot.py setup <bot-token>")
            sys.exit(1)
        setup_bot(sys.argv[2])
    
    elif command == "get-chat-ids":
        get_updates()
    
    elif command == "post":
        if len(sys.argv) < 4:
            print("❌ Usage: python3 bot.py post <agent> <message>")
            sys.exit(1)
        agent = sys.argv[2]
        message = " ".join(sys.argv[3:])
        post_to_agent_channel(agent, message)
    
    elif command == "announce":
        if len(sys.argv) < 3:
            print("❌ Usage: python3 bot.py announce <message>")
            sys.exit(1)
        message = " ".join(sys.argv[2:])
        announce(message)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
