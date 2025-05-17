import { PhoneCall } from 'lucide-react'
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

const SuccessfulListing = () => {
  return (
     <Card className="bg-green-100">
              <CardHeader>
                <CardTitle>Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your Hostel Has been listed successfully.</p>
                <p>
                  Your hostel will be Reviewed and approved within 24 hours{" "}
                  <strong>Fuse</strong> will get in touch.
                </p>
                <p>
                  Or you can call us at:{" "}
                  <strong>
                    <a
                      className="btn btn-neutral text-white btn-sm mt-2"
                      href="tel:+233543983427"
                    >
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Contact Admin
                    </a>
                  </strong>
                </p>
              </CardContent>
            </Card>
  )
}

export default SuccessfulListing