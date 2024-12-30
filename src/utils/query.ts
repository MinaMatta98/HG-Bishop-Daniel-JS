const PUBLIC_BEARERS_TOKEN = '10f4ce9d0ed5b6e8fdfb180cea37406a5f829c9c36b5f9d2cfa0bbd6374e9ea1';

export type CMS = 'sermons-content' | 'ministry-content';

const databaseIDs: Record<CMS, string> = {
  'sermons-content': '671793cdd72eef013c7750a5',
  'ministry-content': '',
};

export type ReqMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class APIQuery {
  public static getQuery = async <T>(method: ReqMethod, id: string, cms: CMS): Promise<T> => {
    console.log(id, `https://api.webflow.com/v2/collections/${databaseIDs[cms]}/items/${id}/live`);
    const response = await fetch(
      `https://api.webflow.com/v2/collections/${databaseIDs[cms]}/items/${id}/live`,
      {
        method,
        headers: {
          Authorization: `Bearer ${PUBLIC_BEARERS_TOKEN}`,
          ContentType: 'application/json',
        },
      }
    );

    const result: any = await response.json();

    console.log(result);

    return result.fieldData as T;
  };
}
