// Attendance requires a reviewed complete export including non-members. The member-only
// String ID table is deliberately not used as a complete attendance source.
export { readSourceFile as collectAttendanceExport } from '../collect'
