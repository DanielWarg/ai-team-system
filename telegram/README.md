# Telegram Integration

Live channels för agents att posta findings + diskutera tillsammans.

## Setup (5 minuter)

### 1. Skapa Bot

**På Telegram:**
1. Sök efter `@BotFather`
2. Skicka `/newbot`
3. Namn: `AI Team System` (eller vad du vill)
4. Username: `DanielTeamBot` (eller annat slutar på "bot")
5. Kopiera bot-token (ser ut som: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**I terminal:**
```bash
cd /Users/evil/projekt-kompass/agents/team-system/telegram
python3 bot.py setup <din-bot-token>
```

### 2. Skapa Grupper

**Skapa 5 Telegram-grupper:**
- `#scout` - Scout's private channel
- `#analyst` - Analyst's private channel
- `#skeptiker` - Skeptiker's private channel
- `#team-discussion` - Alla agents diskuterar här
- `#announcements` - Alice rapporterar hit (Daniel ser)

**Lägg till bot:**
1. Gå in i varje grupp
2. Lägg till medlemmar → sök efter din bot
3. Ge bot "admin"-rättigheter (så den kan posta)

### 3. Få Chat IDs

**Skicka ett meddelande i varje grupp** (typ "test")

**I terminal:**
```bash
python3 bot.py get-chat-ids
```

Detta visar alla chat IDs. Exempel:
```
Recent chats:
  - #scout (group): -1001234567890
  - #analyst (group): -1009876543210
  - #team-discussion (group): -1005555555555
```

**Uppdatera `telegram/config.json`:**
```json
{
  "bot_token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  "chats": {
    "scout": "-1001234567890",
    "analyst": "-1009876543210",
    "skeptiker": "-1008888888888",
    "team": "-1005555555555",
    "announcements": "-1007777777777"
  }
}
```

### 4. Testa

```bash
python3 bot.py post scout "Test från Scout! 🔍"
python3 bot.py announce "Test announcement från Alice 🐇"
```

Du borde se meddelanden i #scout, #team-discussion, och #announcements.

---

## Användning

### Agents Postar Findings

**Scout (efter research):**
```bash
python3 telegram/bot.py post scout "$(cat reports/2026-02-16.md)"
```

**Analyst (efter analys):**
```bash
python3 telegram/bot.py post analyst "$(cat reports/2026-02-16.md)"
```

**Skeptiker (efter granskning):**
```bash
python3 telegram/bot.py post skeptiker "$(cat reports/2026-02-16.md)"
```

**Team Debrief (efter konversation):**
```bash
python3 telegram/bot.py announce "📋 Team Debrief Complete\n\nSummary: ...\nLearnings: ..."
```

### Message Flow

```
Scout posts → #scout + #team-discussion
Analyst posts → #analyst + #team-discussion
Skeptiker posts → #skeptiker + #team-discussion
Team Debrief → #announcements (Daniel ser)
```

**Daniel kan:**
- Följa live i #team-discussion
- Svara/delta i diskussionen
- Få notifications när viktigt händer

---

## Formatting

Telegram stödjer Markdown:

```markdown
**Bold**
*Italic*
`Code`
[Link](https://example.com)

• Bullet
• List

---
Divider
```

Agents använder Markdown i rapporter → ser bra ut i Telegram.

---

## Automation (Next Step)

När setup klar: Agents postar automatiskt efter varje körning.

**Uppdatera cron-jobb:**
```python
# I slutet av Scout's rapport
os.system("python3 telegram/bot.py post scout '$(cat reports/2026-02-16.md)'")
```

Då blir det:
- 06:00: Scout researchar → postar till #scout + #team
- 10:00: Analyst analyserar → postar till #analyst + #team
- 12:00: Skeptiker granskar → postar till #skeptiker + #team
- 12:30: Team Debrief → postar summary till #announcements

**Daniel vaknar kl 08:00:**
- Ser Scout's findings i #team-discussion
- Ser Alice's morning brief i #announcements
- Kan svara/delta direkt

---

## Troubleshooting

**"No bot token configured"**
→ Kör `python3 bot.py setup <token>`

**"No chat ID for scout"**
→ Uppdatera `telegram/config.json` med chat IDs från `get-chat-ids`

**"Failed to send message: 400"**
→ Bot har inte admin-rättigheter i gruppen, eller fel chat ID

**"Failed to send message: 401"**
→ Fel bot token, skapa ny i BotFather

---

**Status:** Setup klar, väntar på Daniel att skapa bot + grupper (5 min).
