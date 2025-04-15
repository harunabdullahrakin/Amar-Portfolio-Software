import { getDb } from "./db";

export function initAnalytics() {
  const db = getDb();
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      referrer TEXT,
      country TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_visitors (
      visitor_id TEXT PRIMARY KEY,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      visit_count INTEGER DEFAULT 1,
      country TEXT,
      browser TEXT,
      os TEXT,
      device_type TEXT
    )
  `);

  console.log("Analytics tables initialized");
}

export function recordPageView(pageData: {
  page_path: string;
  visitor_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
}) {
  try {
    const db = getDb();
    
    db.prepare(`
      INSERT INTO analytics_page_views (
        page_path, visitor_id, ip_address, user_agent, referrer, country
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      pageData.page_path,
      pageData.visitor_id,
      pageData.ip_address || null,
      pageData.user_agent || null,
      pageData.referrer || null,
      pageData.country || null
    );
    
    const visitorExists = db.prepare(
      "SELECT visitor_id FROM analytics_visitors WHERE visitor_id = ?"
    ).get(pageData.visitor_id);
    
    const browser = parseUserAgent(pageData.user_agent || "");
    
    if (visitorExists) {
      db.prepare(`
        UPDATE analytics_visitors SET
          last_visit = CURRENT_TIMESTAMP,
          visit_count = visit_count + 1,
          country = COALESCE(?, country),
          browser = COALESCE(?, browser),
          os = COALESCE(?, os),
          device_type = COALESCE(?, device_type)
        WHERE visitor_id = ?
      `).run(
        pageData.country,
        browser.browser, 
        browser.os,
        browser.device,
        pageData.visitor_id
      );
    } else {
      db.prepare(`
        INSERT INTO analytics_visitors (
          visitor_id, country, browser, os, device_type
        ) VALUES (?, ?, ?, ?, ?)
      `).run(
        pageData.visitor_id,
        pageData.country,
        browser.browser,
        browser.os,
        browser.device
      );
    }
    
    return true;
  } catch (error) {
    console.error("Error recording page view:", error);
    return false;
  }
}

function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";
  
  if (userAgent.includes("Firefox/")) {
    browser = "Firefox";
  } else if (userAgent.includes("Edg/")) {
    browser = "Edge";
  } else if (userAgent.includes("Chrome/")) {
    browser = "Chrome";
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    browser = "Safari";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    browser = "Internet Explorer";
  }
  
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS X")) {
    os = "macOS";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  }
  
  if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
    device = "Mobile";
  } else if (userAgent.includes("iPad") || userAgent.includes("Tablet")) {
    device = "Tablet";
  }
  
  return { browser, os, device };
}

export function getAnalyticsOverview() {
  const db = getDb();
  
  try {
    const totalPageViews = db.prepare("SELECT COUNT(*) as count FROM analytics_page_views").get() as { count: number };
    
    const uniqueVisitors = db.prepare("SELECT COUNT(*) as count FROM analytics_visitors").get() as { count: number };
    
    const pageViews = db.prepare(`
      SELECT page_path, COUNT(*) as views
      FROM analytics_page_views
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 10
    `).all();
    
    const visitorsByCountry = db.prepare(`
      SELECT country, COUNT(*) as count
      FROM analytics_visitors
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `).all();
    
    const visitorsByBrowser = db.prepare(`
      SELECT browser, COUNT(*) as count
      FROM analytics_visitors
      WHERE browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
    `).all();
    
    const visitorsByOS = db.prepare(`
      SELECT os, COUNT(*) as count
      FROM analytics_visitors
      WHERE os IS NOT NULL
      GROUP BY os
      ORDER BY count DESC
    `).all();
    
    const visitorsByDevice = db.prepare(`
      SELECT device_type, COUNT(*) as count
      FROM analytics_visitors
      WHERE device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY count DESC
    `).all();
    
    const recentTraffic = db.prepare(`
      SELECT 
        strftime('%Y-%m-%d', timestamp) as date, 
        COUNT(*) as views
      FROM analytics_page_views
      WHERE timestamp > datetime('now', '-7 days')
      GROUP BY date
      ORDER BY date
    `).all();
    
    return {
      totalPageViews: Number(totalPageViews.count),
      uniqueVisitors: Number(uniqueVisitors.count),
      pageViews,
      visitorsByCountry,
      visitorsByBrowser,
      visitorsByOS,
      visitorsByDevice,
      recentTraffic
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return null;
  }
}