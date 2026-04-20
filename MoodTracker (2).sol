// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MoodTracker
 * @notice On-Chain Mood Tracker — store your daily mood on Base
 * @dev One mood per wallet per day, gas-optimized with packed storage
 */
contract MoodTracker {

    // ─────────────────────────────────────────────
    // TYPES
    // ─────────────────────────────────────────────

    /**
     * @dev Mood enum — stored as uint8 (0-6), saves gas vs string
     * 0=Happy, 1=Sad, 2=Excited, 3=Angry, 4=Calm, 5=Anxious, 6=Grateful
     */
    enum Mood { Happy, Sad, Excited, Angry, Calm, Anxious, Grateful }

    /**
     * @dev Packed into 1 storage slot (5 bytes total) — gas efficient
     */
    struct MoodEntry {
        Mood mood;
        uint32 timestamp;
    }

    // ─────────────────────────────────────────────
    // STATE VARIABLES
    // ─────────────────────────────────────────────

    mapping(address => MoodEntry[]) private userMoods;
    mapping(address => uint32) private lastSubmitDay;
    uint256[7] private moodCounts;
    uint256 public totalSubmissions;

    // ─────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────

    event MoodLogged(address indexed user, Mood mood, uint256 timestamp);

    // ─────────────────────────────────────────────
    // CUSTOM ERRORS (cheaper than require strings)
    // ─────────────────────────────────────────────

    error AlreadySubmittedToday();
    error InvalidMood();

    // ─────────────────────────────────────────────
    // WRITE FUNCTION
    // ─────────────────────────────────────────────

    function logMood(Mood _mood) external {
        uint8 moodValue = uint8(_mood);
        if (moodValue > 6) revert InvalidMood();

        uint32 today = uint32(block.timestamp / 86400);
        if (lastSubmitDay[msg.sender] == today) revert AlreadySubmittedToday();

        lastSubmitDay[msg.sender] = today;

        userMoods[msg.sender].push(MoodEntry({
            mood: _mood,
            timestamp: uint32(block.timestamp)
        }));

        moodCounts[moodValue]++;
        totalSubmissions++;

        emit MoodLogged(msg.sender, _mood, block.timestamp);
    }

    // ─────────────────────────────────────────────
    // READ FUNCTIONS (free — no gas)
    // ─────────────────────────────────────────────

    function getUserMoodHistory(address _user)
        external view returns (MoodEntry[] memory)
    {
        return userMoods[_user];
    }

    function getUserMoodCount(address _user)
        external view returns (uint256)
    {
        return userMoods[_user].length;
    }

    function hasSubmittedToday(address _user)
        external view returns (bool)
    {
        return lastSubmitDay[_user] == uint32(block.timestamp / 86400);
    }

    function getTodayMood(address _user)
        external view returns (Mood mood, uint32 timestamp, bool exists)
    {
        uint256 length = userMoods[_user].length;
        if (length == 0) return (Mood.Happy, 0, false);

        MoodEntry memory last = userMoods[_user][length - 1];
        uint32 today = uint32(block.timestamp / 86400);

        if (last.timestamp / 86400 == today) {
            return (last.mood, last.timestamp, true);
        }
        return (Mood.Happy, 0, false);
    }

    function getGlobalStats()
        external view returns (uint256[7] memory counts, uint256 total)
    {
        return (moodCounts, totalSubmissions);
    }

    function getUserStreak(address _user)
        external view returns (uint256 streak)
    {
        MoodEntry[] memory entries = userMoods[_user];
        uint256 length = entries.length;
        if (length == 0) return 0;

        uint32 expectedDay = uint32(block.timestamp / 86400);

        for (uint256 i = length; i > 0; i--) {
            uint32 entryDay = entries[i - 1].timestamp / 86400;
            if (entryDay == expectedDay) {
                streak++;
                expectedDay--;
            } else {
                break;
            }
        }
    }
}
