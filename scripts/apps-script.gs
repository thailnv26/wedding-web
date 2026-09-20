/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — NHẬN RSVP VÀ LỜI CHÚC
 * ============================================================
 *  Cách dùng:
 *  1. Tạo một Google Sheet mới.
 *  2. Menu Tiện ích mở rộng (Extensions) -> Apps Script.
 *  3. Xoá hết code mẫu, dán toàn bộ file này vào.
 *  4. Bấm Deploy -> New deployment -> Type: Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  5. Copy URL dạng https://script.google.com/macros/s/..../exec
 *     rồi dán vào `rsvp.endpoint` trong data/config.ts
 *
 *  Mỗi lần sửa code phải Deploy lại (New deployment hoặc Manage -> Edit -> Version: New).
 * ============================================================
 */

var SHEET_NAME = "RSVP";
var HEADERS = ["Thời gian", "Tên khách", "Tham dự", "Số người", "Lời chúc", "Bên"];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Nhận form xác nhận từ thiệp. */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      String(data.name || "").slice(0, 100),
      data.attending === "yes" ? "Có" : "Không",
      Number(data.guests) || 0,
      String(data.wish || "").slice(0, 1000),
      String(data.side || "").slice(0, 40),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Trả danh sách lời chúc cho sổ lưu bút (JSONP: ?action=wishes&callback=tenHam). */
function doGet(e) {
  var params = (e && e.parameter) || {};

  if (params.action !== "wishes") {
    return json_({ ok: true, message: "Web app đang chạy." });
  }

  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  var wishes = [];

  if (lastRow > 1) {
    var rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      var wish = String(rows[i][4] || "").trim();
      if (!wish) continue;
      wishes.push({
        name: String(rows[i][1] || "Khách mời"),
        attending: String(rows[i][2] || ""),
        wish: wish,
        time: rows[i][0] ? new Date(rows[i][0]).toISOString() : "",
      });
      if (wishes.length >= 50) break;
    }
  }

  if (params.callback) {
    return ContentService.createTextOutput(
      params.callback + "(" + JSON.stringify(wishes) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(wishes);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
