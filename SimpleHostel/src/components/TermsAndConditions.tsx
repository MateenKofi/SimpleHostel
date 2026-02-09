import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Shield, Eye, Cookie} from "lucide-react"


const TermsAndCondition = () => {

  return (
    <div className="grid w-full max-w-3xl p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <FileText className="w-8 h-8" />
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground">Please review and accept our terms to continue using our services</p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 ">
        {/* Terms Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="terms" className="text-xs">
                Terms
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs">
                Privacy
              </TabsTrigger>
              <TabsTrigger value="cookies" className="text-xs">
                Cookies
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Terms of Service
                  </CardTitle>
                  <CardDescription>These terms govern your use of our platform and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="mb-2 font-semibold">1. Acceptance of Terms</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          By accessing and using this website, you accept and agree to be bound by the terms and
                          provision of this agreement. If you do not agree to abide by the above, please do not use this
                          service.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">2. Use License</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          Permission is granted to temporarily download one copy of the materials on our website for
                          personal, non-commercial transitory viewing only. This is the grant of a license, not a
                          transfer of title, and under this license you may not:
                        </p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                          <li>modify or copy the materials</li>
                          <li>use the materials for any commercial purpose or for any public display</li>
                          <li>attempt to reverse engineer any software contained on the website</li>
                          <li>remove any copyright or other proprietary notations from the materials</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">3. Disclaimer</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          The materials on our website are provided on an 'as is' basis. We make no warranties,
                          expressed or implied, and hereby disclaim and negate all other warranties including without
                          limitation, implied warranties or conditions of merchantability, fitness for a particular
                          purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">4. Limitations</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          In no event shall our company or its suppliers be liable for any damages (including, without
                          limitation, damages for loss of data or profit, or due to business interruption) arising out
                          of the use or inability to use the materials on our website, even if we or our authorized
                          representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">5. Account Terms</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          You are responsible for safeguarding the password that you use to access the service and for
                          all activities that occur under your account. You must immediately notify us of any
                          unauthorized uses of your account or any other breaches of security.
                        </p>
                      </section>
                      <section>
                        <h3 className="mb-2 font-semibold">6. Payment Plan and Billing</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          Our payment plan is based on a 15% service rate. you will be billed on 15% of the total transaction.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Policy
                  </CardTitle>
                  <CardDescription>How we collect, use, and protect your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="mb-2 font-semibold">Information We Collect</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          We collect information you provide directly to us, such as when you create an account, make a
                          purchase, or contact us for support. This may include your name, email address, phone number,
                          and payment information.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">How We Use Your Information</h3>
                        <p className="leading-relaxed text-muted-foreground">We use the information we collect to:</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                          <li>Provide, maintain, and improve our services</li>
                          <li>Process transactions and send related information</li>
                          <li>Send you technical notices and support messages</li>
                          <li>Respond to your comments and questions</li>
                          <li>Monitor and analyze trends and usage</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Information Sharing</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          We do not sell, trade, or otherwise transfer your personal information to third parties
                          without your consent, except as described in this policy. We may share your information with
                          trusted service providers who assist us in operating our website and conducting our business.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Data Security</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          We implement appropriate security measures to protect your personal information against
                          unauthorized access, alteration, disclosure, or destruction. However, no method of
                          transmission over the internet is 100% secure.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cookies">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cookie className="w-5 h-5" />
                    Cookie Policy
                  </CardTitle>
                  <CardDescription>How we use cookies and similar technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="mb-2 font-semibold">What Are Cookies</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          Cookies are small text files that are placed on your computer or mobile device when you visit
                          our website. They are widely used to make websites work more efficiently and provide
                          information to website owners.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Types of Cookies We Use</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">Essential Cookies</h4>
                            <p className="text-xs text-muted-foreground">
                              Required for the website to function properly. Cannot be disabled.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Analytics Cookies</h4>
                            <p className="text-xs text-muted-foreground">
                              Help us understand how visitors interact with our website.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Marketing Cookies</h4>
                            <p className="text-xs text-muted-foreground">
                              Used to track visitors across websites to display relevant advertisements.
                            </p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Managing Cookies</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          You can control and/or delete cookies as you wish. You can delete all cookies that are already
                          on your computer and you can set most browsers to prevent them from being placed.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Data Processing Agreement
                  </CardTitle>
                  <CardDescription>How we process and handle your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="mb-2 font-semibold">Legal Basis for Processing</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          We process your personal data based on the following legal grounds:
                        </p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                          <li>Your consent for specific processing activities</li>
                          <li>Performance of a contract with you</li>
                          <li>Compliance with legal obligations</li>
                          <li>Legitimate interests pursued by us or third parties</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Your Rights</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          Under data protection laws, you have the right to:
                        </p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                          <li>Access your personal data</li>
                          <li>Rectify inaccurate personal data</li>
                          <li>Erase your personal data</li>
                          <li>Restrict processing of your personal data</li>
                          <li>Data portability</li>
                          <li>Object to processing</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-2 font-semibold">Data Retention</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          We retain your personal data only for as long as necessary to fulfill the purposes for which
                          it was collected, including for the purposes of satisfying any legal, accounting, or reporting
                          requirements.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
      </div>
    </div>
  )
}

export default TermsAndCondition