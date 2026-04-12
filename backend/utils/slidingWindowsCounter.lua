 export const LUA_SCRIPT =`
local current_key = KEYS[1]
local previous_key = KEYS[2]
local max_requests = tonumber(ARGV[1])
local window_seconds = tonumber(ARGV[2])
local elapsed = tonumber(ARGV[3])

local prev_count = tonumber(redis.call('GET', previous_key) or '0') or 0
local current_count = tonumber(redis.call('GET', current_key) or '0') or 0

local weighted_prev = prev_count * (1 - elapsed)
local estimated = weighted_prev + current_count

if estimated >= max_requests then
  return { 0, 0, math.floor(current_count) }
end

local new_count = redis.call('INCR', current_key)

if new_count == 1 then
  redis.call('EXPIRE', current_key, window_seconds * 2)
end

local new_estimate = weighted_prev + new_count
local remaining = math.max(0, math.floor(max_requests - new_estimate))

return { 1, remaining, new_count }
`;
