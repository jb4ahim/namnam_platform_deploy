// libs/database/src/database.utils.ts

/**
 * Utility function to extract data from PostgreSQL function results
 * Handles the common pattern where PostgreSQL functions return data nested in a property
 */
export class DatabaseUtils {
  /**
   * Extract single row from PostgreSQL function result
   * @param rows - Result from pg.query()
   * @param functionName - Name of the PostgreSQL function called
   * @returns Extracted data or null if not found
   */
  static extractSingleResult<T = any>(rows: any[], functionName: string): T | null {
    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    console.log('row', row);
    console.log('functionName', functionName);
    console.log('rows', rows);
    console.log('rows[0]', rows[0]);
    console.log('row[functionName]', row[functionName]);
    // Check if data is nested in function name property
    if (row && typeof row === 'object') {
      return row[functionName];
    }
    
    // Otherwise return the row directly
    return row;
  }

  /**
   * Extract multiple rows from PostgreSQL function result
   * @param rows - Result from pg.query()
   * @param functionName - Name of the PostgreSQL function called
   * @returns Array of extracted data
   */
  static extractMultipleResults<T = any>(rows: any[], functionName: string): T[] {
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map(row => {
      // Check if data is nested in function name property
      if (row && typeof row === 'object' && row[functionName]) {
        return row[functionName];
      }
      
      // Otherwise return the row directly
      return row;
    });
  }

  /**
   * Generic function to call PostgreSQL functions and extract results
   * @param pg - PostgresService instance
   * @param functionName - Name of the PostgreSQL function
   * @param params - Parameters for the function
   * @param expectMultiple - Whether to expect multiple results
   * @returns Extracted data
   */
  static async callFunction<T = any>(
    pg: any, 
    functionName: string, 
    params: any[] = [], 
    expectMultiple: boolean = false
  ): Promise<T | T[] | null> {
    const query = `SELECT ${functionName}(${params.map((_, i) => `$${i + 1}`).join(', ')})`;
    const rows = await pg.query(query, params);
    
    if (expectMultiple) {
      return this.extractMultipleResults<T>(rows, functionName);
    } else {
      return this.extractSingleResult<T>(rows, functionName);
    }
  }

  /**
   * Generic function to call PostgreSQL procedures
   * @param pg - PostgresService instance
   * @param procedureName - Name of the PostgreSQL procedure
   * @param params - Parameters for the procedure
   * @returns Procedure result
   */
  static async callProcedure<T = any>(
    pg: any, 
    procedureName: string, 
    params: any[] = []
  ): Promise<T | null> {
    const placeholders = params.map((_, i) => `$${i + 1}`).join(', ');
    const query = `CALL ${procedureName}(${placeholders})`;
    const rows = await pg.query(query, params);
    
    return rows?.[0] || null;
  }
}