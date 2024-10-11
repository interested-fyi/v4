import { getEndorsementUid } from './get-endorsement-uid';

describe('getEndorsementUid', () => {
  it('should get logs for tx hash', async () => {
    const uid = await getEndorsementUid("0x49e58e916431369379e13229985cdf3c1ffea56278509498965bf6b0f6ce2df5");
    expect(uid).toBe("0x5671c67018a50a86ad31c42bc736608766dbde85419949df46e194ad1a49e62d");
  });

});