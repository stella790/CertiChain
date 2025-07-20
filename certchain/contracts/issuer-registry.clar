;; issuer-registry.clar
;; Contract to manage verified certificate issuers (non-transferable NFTs)

(define-data-var admin principal tx-sender)

(define-map verified-issuers principal bool)

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-FOUND u102)

;; Checks if the caller is the current admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; PUBLIC: Register a new verified issuer
(define-public (register-issuer (issuer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? verified-issuers issuer)) (err ERR-ALREADY-VERIFIED))
    (map-set verified-issuers issuer true)
    (ok true)
  )
)

;; PUBLIC: Remove an issuer
(define-public (remove-issuer (issuer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-issuers issuer)) (err ERR-NOT-FOUND))
    (map-delete verified-issuers issuer)
    (ok true)
  )
)

;; READ-ONLY: Check if issuer is verified
(define-read-only (is-verified (issuer principal))
  (default-to false (map-get? verified-issuers issuer))
)

;; PUBLIC: Transfer admin role to a new principal
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
