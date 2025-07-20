import { describe, it, expect, beforeEach } from "vitest"

// Mock contract state
const mockContract = {
  admin: "ST1ADMIN111111111111111111111111111111111",
  verifiedIssuers: new Map<string, boolean>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerIssuer(caller: string, issuer: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    if (this.verifiedIssuers.has(issuer)) return { error: 101 } // ERR-ALREADY-VERIFIED
    this.verifiedIssuers.set(issuer, true)
    return { value: true }
  },

  removeIssuer(caller: string, issuer: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    if (!this.verifiedIssuers.has(issuer)) return { error: 102 } // ERR-NOT-FOUND
    this.verifiedIssuers.delete(issuer)
    return { value: true }
  },

  isVerified(issuer: string): boolean {
    return this.verifiedIssuers.has(issuer)
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    this.admin = newAdmin
    return { value: true }
  },
}

describe("issuer-registry.clar", () => {
  beforeEach(() => {
    // Reset contract state before each test
    mockContract.admin = "ST1ADMIN111111111111111111111111111111111"
    mockContract.verifiedIssuers = new Map()
  })

  it("should allow admin to register a new issuer", () => {
    const result = mockContract.registerIssuer(
      "ST1ADMIN111111111111111111111111111111111",
      "ST2ISSUER222222222222222222222222222222222"
    )

    expect(result).toEqual({ value: true })
    expect(mockContract.isVerified("ST2ISSUER222222222222222222222222222222222")).toBe(true)
  })

  it("should prevent non-admin from registering issuer", () => {
    const result = mockContract.registerIssuer(
      "ST3NOTADMIN999999999999999999999999999999999",
      "ST2ISSUER222222222222222222222222222222222"
    )

    expect(result).toEqual({ error: 100 })
    expect(mockContract.isVerified("ST2ISSUER222222222222222222222222222222222")).toBe(false)
  })

  it("should not allow registering an already verified issuer", () => {
    mockContract.registerIssuer("ST1ADMIN111111111111111111111111111111111", "ST2ISSUER")
    const result = mockContract.registerIssuer("ST1ADMIN111111111111111111111111111111111", "ST2ISSUER")

    expect(result).toEqual({ error: 101 }) // ERR-ALREADY-VERIFIED
  })

  it("should allow admin to remove a verified issuer", () => {
    mockContract.registerIssuer("ST1ADMIN111111111111111111111111111111111", "ST2ISSUER")
    const result = mockContract.removeIssuer("ST1ADMIN111111111111111111111111111111111", "ST2ISSUER")

    expect(result).toEqual({ value: true })
    expect(mockContract.isVerified("ST2ISSUER")).toBe(false)
  })

  it("should prevent non-admin from removing issuer", () => {
    mockContract.registerIssuer("ST1ADMIN111111111111111111111111111111111", "ST2ISSUER")
    const result = mockContract.removeIssuer("ST4HACKER444444444444444444444444444444444", "ST2ISSUER")

    expect(result).toEqual({ error: 100 })
    expect(mockContract.isVerified("ST2ISSUER")).toBe(true)
  })

  it("should fail when removing non-existent issuer", () => {
    const result = mockContract.removeIssuer("ST1ADMIN111111111111111111111111111111111", "ST2MISSING")

    expect(result).toEqual({ error: 102 }) // ERR-NOT-FOUND
  })

  it("should transfer admin rights to a new principal", () => {
    const result = mockContract.transferAdmin(
      "ST1ADMIN111111111111111111111111111111111",
      "ST5NEWADMIN"
    )

    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST5NEWADMIN")

    const newAdminResult = mockContract.registerIssuer("ST5NEWADMIN", "ST6NEWISSUER")
    expect(newAdminResult).toEqual({ value: true })
    expect(mockContract.isVerified("ST6NEWISSUER")).toBe(true)
  })
})
