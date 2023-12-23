import { connect, getConnection } from "@heja/shared/mongodb";

export async function getDbConnection() {
  try {
    return getConnection();
  } catch (e: unknown) {
    await connect({});
    return getConnection();
  }
}
